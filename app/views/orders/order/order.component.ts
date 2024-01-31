import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, merge, of, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap, scan, shareReplay, distinctUntilChanged, debounceTime, takeUntil, filter, withLatestFrom } from 'rxjs/operators';
import { ERoomType, ICategory, IOrderItem, IOrderItemLight, IOrderItemSemplify, IOrderMenu, IRoom, IStoredMenuList } from '../../../models/order.model';
import { UiService } from '../../../services/ui.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderCartComponent } from '../order-cart/order-cart.component';
import { OrderNoteComponent } from '../order-note/order-note.component';
import { OrderInfosComponent } from '../order-infos/order-infos.component';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { groupBy, intersection } from 'lodash';
import { GetOrderInfo, GetOrderPageInfo, GetCategories } from '../../../store/orders/selectors';
import * as fromActions  from '../../../store/orders/actions';
import { Actions, ofType } from '@ngrx/effects';
import { CanUseRestaurantWishes, GetCurrency } from '../../../store/ui/selectors';
import { StoreService } from '../../../services/store.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { OrderDetailComponent } from '../order-details/order-details.component';
import { SetCurrentPage } from '../../../store/ui/actions';

enum ELayoutType {
  LIST = 1,
  GRID = 2
}

interface StartState {
  key: number;
  layout: ELayoutType;
  path: any[];
  collapsed: boolean;
  collapsedList: boolean;
  search: boolean;
  categories: boolean;
}

interface OrderState {
  Items: Array<IOrderItem | IOrderMenu>;
  Notes: any[];
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  
  public Form: FormGroup = this.fb.group({
    Search: this.fb.control('')
  })

  private readonly initialState: StartState = { key: 1, path: [], layout: ELayoutType.GRID, collapsed: false, collapsedList: false, search: false, categories: false };
  private readonly initialOrderState: OrderState = { Items: [], Notes: [] };
  // private storedItems$: BehaviorSubject<IStoredMenuList | null> = new BehaviorSubject<IStoredMenuList | null>(null);
  private storedItems$: BehaviorSubject<IStoredMenuList | null> = new BehaviorSubject<IStoredMenuList | null>(null);
  // public Items$: Observable<IStoredMenuList | null> = this.storedItems$.asObservable();
  public Items$: Observable<IStoredMenuList | null> = this.storedItems$.asObservable();
  public Menu$!: Observable<IStoredMenuList>;
  
  private ChangeType$: Subject<any> = new Subject<any>();
  private ChangeState$: Subject<any> = new Subject<any>();
  private ChangePath$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public OrderState$!: Observable<OrderState>; 
  public Data$!: Observable<IRoom>;

  public ComponentClasses$!: Observable<any>;
  public Sink$!: Observable<StartState>;
  public Status$!: Observable<any>;

  private innerTotal: number = 0;
  public Total$!: Observable<number>;

  private OrderItems$: BehaviorSubject<IOrderItem[]> = new BehaviorSubject<IOrderItem[]>([]);
  public OrderItemsState$: Observable<any> = this.OrderItems$.asObservable().pipe( map(t => ({Items: t})));

  private refactoryItems$: BehaviorSubject<IOrderItemLight[] | null> = new BehaviorSubject<IOrderItemLight[] | null>(null);
  public RefactoryItemsState$: Observable<IOrderItemLight[] | null> = this.refactoryItems$.asObservable();
  private destroy$ = new Subject();
  private parentCode: string = '';

  /** REFACTORING  */
  private result$: Subject<any> = new BehaviorSubject({Layout: ELayoutType.GRID, Data: []});
  private resultState$: Observable<any> = this.result$.asObservable();
  public ResultState$!: Observable<any>;

  private lastState$ = new Subject();
  private saved: boolean = true;
  public PageInfo$: Observable<{Description: string, Room: string, Place: string} | null> = this.store.pipe( select(GetOrderPageInfo) )
  
  public Currency$ = this.store.pipe( select(GetCurrency) );
  public HasTable: boolean = false;

  private dialogRef!: any;

  private selectedCategories$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  private selectedCategoriesState$: Observable<string[]> = this.selectedCategories$.asObservable();

  private categories$: Observable<ICategory[]> = this.store.pipe( select(GetCategories) );
  public CategoriesState$: Observable<any[]> = combineLatest([this.categories$, this.selectedCategoriesState$]).pipe( map( ([categories, selected]) => categories.map( c => ({...c, Selected: selected.includes(c.Codice) }) ) ), shareReplay(1) );
  public CategoriesStateSelected$ = this.CategoriesState$.pipe( map( Categories => Categories.filter( c => c.Selected ) ))

  public CanUseRestaurantWishes$: Observable<boolean> = this.store.pipe( select(CanUseRestaurantWishes), map( r => r || false) );
  public HasMenu: boolean = false;
  public HasFavorites: boolean = false;
  public HasCategories: boolean = false;
  
  private storedData!: IOrderItemLight[];

  private parseItemsForOrder (items: Array<IOrderItem | IOrderMenu>) {
    let menuInc = 1;
    let result =  items.reduce( (acc: IOrderItemSemplify[], item: IOrderItem | IOrderMenu) => {
      let i: any[] = [];
      if(item.Articles) {
        i = item.Articles.map( (e: any) => ({
          Articolo: e.Codice, // article Code
          Quantita: 1,
          ProgMenu: menuInc,
          CodiceMenu: item.Codice,
          Preferenza: e.Note || '',
        }))
        menuInc = menuInc + 1;
      }else{
        i = [{
          Articolo: item.Codice, // article Code
          Quantita: 1,
          Preferenza: item.Note || '',
        }]
      }

      return ([...acc, ...i]);

    }, []);
    console.log('parseItemsForOrder', result);
    return result;

  }

  toggleCategory(item: string) {
    const items = this.selectedCategories$.getValue();
    const newItems = items.includes(item) ? items.filter( v => v !== item) : [...items, item];
    this.selectedCategories$.next(newItems);
  }

  onMenuChange(key: number) {
    switch (key) {
      case 3: 
        this.store.dispatch( fromActions.GetFavoritesItems() )
        break;
      case 2:
        this.store.dispatch( fromActions.GetMenuItems() )
        break;
      default:
        this.result$.next( {Layout: ELayoutType.GRID, Data: this.storedData })
        break;
    }
    this.ChangeType$.next({key: key, path: []});
  }

  onClearPath(key: number) {
    this.onMenuChange( key );
    this.ChangePath$.next(null);
  }

  onCollapseList(state: boolean) {
    if(state){
      this.ChangeState$.next({collapsedList: state, collapsed: false});
    }else{
      this.ChangeState$.next({collapsedList: state});
    }
  }

  onSelectArticle(item: any) {
    this.result$.next(
      {Layout: ELayoutType.LIST, Data: [item]}
    )
  }

  onCollapse(state: boolean) {
    this.ChangeState$.next({collapsed: state});
  }
  onSetSearch(state: boolean) {
    if(!state) {
      /** reset su piatti  */
      this.onClearPath(1);
    }else{
      this.result$.next({Layout: ELayoutType.LIST, Data: []})
    }
    this.ChangeState$.next({search: state});
  }
  onSetFilters(state: boolean) {
    this.ChangeState$.next({categories: !state});
  }

  onSelectItem(item: IOrderItemLight) {
    console.log(item);
    this.ChangePath$.next(item)

    if(item.SubTipiPiatto && item.SubTipiPiatto.length) {
      console.log(item.SubTipiPiatto);
      this.parentCode = item.Codice;
      // this.result$.next({Layout: 2, Data: item.SubTipiPiatto.map(p => ({...p, SubTipoFittizio: true})) } )
      this.result$.next({Layout: 2, Data: item.SubTipiPiatto.map(p => ({...p})) } )
    }else{
      console.log(item.SubTipoFittizio, this.parentCode, item.SubTipiPiatto);
      if(!item.SubTipoFittizio && !item.SubTipiPiatto){
        return this.store.dispatch( fromActions.GetItemSubType({payload: this.parentCode, subType: item.Codice}) )
      }else if(item.SubTipoFittizio) {
        return this.store.dispatch( fromActions.GetItemSubType({payload: this.parentCode}) )
      } else {
        this.parentCode = '';
        return this.store.dispatch( fromActions.GetItemSubType({payload: item.Codice}) )
      }
    }
  }

  // onSelectItem(item: IOrderItem) {
  //   let res = {};
  //   const current = this.ChangePath$.getValue();
  //   console.log(item)
  //   if( Array.isArray(item) ) {
  //     res = {...res, path: [...current.path, {
  //       Descrizione: item[0],
  //       SubTipo: item[0]
  //     }]}
  //   }else{

  //     if(current && current.hasOwnProperty('path')) {
  //       res = {path: [...current.path, item]};
  //     } else{
  //       res = {path: [...current, item]};
  //     }

  //   }
  //   this.ChangePath$.next(res);
  // };

  //#region Menu

  public onChangeItem(ev: any, qta: number) {
    // const items = this.OrderItems$.getValue();
    // let payload
    // if(!items.find( i => i.Codice === ev.Codice )){
    //   payload = [...items, {...ev, Qta: (ev.Qta || 1)}]
    // }else{
    //   payload = items.map( i => i.Codice !== ev.Codice ? i : ({...i, Qta: (i.Qta || 1) + qta}) ).filter(i => i.Qta && i.Qta > 0);
    // }
    const items = this.OrderItems$.getValue();

    if(qta > 0) {
      this.OrderItems$.next([...items,ev]);
    }else{
      const index = items.findIndex( i => i.Codice === ev.Codice);
      const res = items.splice(index, 1);
      this.OrderItems$.next(items);
    }

  }

  public onRemove(index: number) {
    const items = this.OrderItems$.getValue();
    this.OrderItems$.next(items.filter( (item, i) => i !== index ));
  }
  //#endregion

  /*
  order.map( o => ({
      Articolo: o.Codice,
      Quantita: 1,
      ProgMenu: 0,
      CodiceMenu: '',
      Preferenza: o.Note || '',
      IsMenu: o.Menu
    })
    */

  onPreview() {
    const items = this.OrderItems$.getValue();
    this.store.dispatch( fromActions.PreviewOrder({payload: this.parseItemsForOrder(items) }) );
  }

  onNote(ev: any, index: number, menu?: any) {
    if( isDevMode() ) {
      console.log('note',ev, index, menu);
    }
    const dialogRef = this.dialog.open(OrderNoteComponent);
    dialogRef.componentInstance.Item = ev;
    dialogRef.componentInstance.Save.subscribe( (event: any) => {
      if(menu) {
        const res = this.OrderItems$.getValue().map( (v, i) => {
          if(i === index) {
            return {...v, Articles: v?.Articles?.map( e => {
                if(e.Codice === event.Codice) {
                  return event;
                }else{
                  return e;
                }
              })
            }
          } else {
            return v;
          }
        });
        this.OrderItems$.next(res);
        dialogRef.close();
      }else{
        const res = this.OrderItems$.getValue().map( (o, i) => i === index ? event : o  )
        this.OrderItems$.next(res);
        dialogRef.close();

      }

    })
  }

  canDeactivate() {
    if (!this.saved) {
      return window.confirm('Are you sure you want leave ?');
    }
    return true;
  }

  onInfos(ev: any) {
    this.store.dispatch( fromActions.GetItemOrderDetail({payload: ev.Codice}) );
  }

  onMenuInfos(ev: any) {
    const dialogRef = this.dialog.open(OrderInfosComponent, {data: ev});
  }

  public GetKeyName(key: number) {
    switch (key) {
      case 2:
        return this.translateService.instant('BUTTONS.MENU_MENU');
      case 3:
        return this.translateService.instant('BUTTONS.MENU_FREQUENTI');
    
      default:
        return this.translateService.instant('BUTTONS.MENU_PIATTI');
    }
  }

  constructor(
    private Actions$: Actions,
    private router: Router,
    private route: ActivatedRoute, 
    private store: Store<AppState>, 
    private storeService: StoreService,
    private translateService: TranslateService,
    public dialog: MatDialog, 
    public fb: FormBuilder
  ) { 
    this.store.dispatch( SetCurrentPage({payload: 'order'}) );
  }

  ngOnInit(): void {

    this.HasTable = !!(this.route.snapshot.params['position']);
    this.store.dispatch( fromActions.CheckFavoritesItems() );
    this.store.dispatch( fromActions.CheckMenuItems() );
    this.store.dispatch( fromActions.GetCategories() );

    this.store.pipe( select(GetOrderInfo), takeUntil(this.destroy$) ).subscribe(  );
    this.store.pipe( select(GetCategories), takeUntil(this.destroy$) ).subscribe( r => this.HasCategories = !!(r && r.length) );

    this.OrderState$ = merge( this.OrderItemsState$ ).pipe(
      scan( (acc, curr: any) => ({...acc, ...curr}), this.initialOrderState), 
      shareReplay(1)
    );

    this.Total$ = this.OrderState$.pipe( map( t => t?.Items.reduce((acc: number, curr: IOrderItem | IOrderMenu) => acc += ((curr.Prezzo || 0.00) ), 0) || 0), tap( t => this.innerTotal = t ) );

    this.ResultState$ = combineLatest( this.resultState$ , this.OrderItemsState$, this.CategoriesStateSelected$).pipe(

      map( ([a,b, categories]) => {
        const selectedCategories = categories.map( c => c.Codice );
        const filterdByCategories = selectedCategories.length ? a.Data.filter( (i: any) => intersection(i.CategorieSpeciali, selectedCategories ).length === selectedCategories.length ): a.Data;
        const countsObject = groupBy(b.Items, 'Codice');
        return ({...a, Data: filterdByCategories.map( (d: any) => ({...d, Qta: countsObject[d.Codice]?.length }) ) })
      })
    
    );

    this.Actions$.pipe(
      ofType(fromActions.GetItemSubTypeSuccess, fromActions.GetSearchItemsSuccess),
      map( result => result.payload),
      takeUntil(this.destroy$)
    ).subscribe( r => this.result$.next({Layout: ELayoutType.LIST, Data: r} ) )

    this.Actions$.pipe(
      ofType(fromActions.GetMenuItemsSuccess),
      map( result => result.payload?.filter( r => !r.Componibile) ),
      takeUntil(this.destroy$)
    ).subscribe( r => this.result$.next({Layout: ELayoutType.LIST, Data: r} ) )

    this.Actions$.pipe(
      ofType(fromActions.GetFavoritesItemsSuccess),
      map( result => result.payload),
      takeUntil(this.destroy$)
    ).subscribe( r => this.result$.next({Layout: ELayoutType.LIST, Data: r} ) )


    this.Actions$.pipe(
      ofType(fromActions.CheckFavoritesItemsSuccess, fromActions.CheckFavoritesItemsFail),
      map( result => result.payload),
      takeUntil(this.destroy$)
    ).subscribe( r => this.HasFavorites = !!(r.length) )

    this.Actions$.pipe(
      ofType(fromActions.CheckMenuItemsSuccess, fromActions.CheckMenuItemsFail),
      map( result => result.payload?.filter( r => !r.Componibile) ),
      takeUntil(this.destroy$)
    ).subscribe( r => this.HasMenu = !!(r.length) )

    this.Actions$.pipe(
      ofType(fromActions.PreviewOrderSuccess),
      takeUntil(this.destroy$)
    ).subscribe( r => {
      console.log(r);
      const items = this.OrderItems$.getValue();
      this.dialogRef = this.dialog.open(OrderCartComponent);
      this.dialogRef.componentInstance.Items = items;
      this.dialogRef.componentInstance.Total = this.innerTotal;
      this.dialogRef.componentInstance.Increase = r.increase;

      this.dialogRef.componentInstance.Dismiss.subscribe( (data: string) => {
        this.dialogRef.close();
      })

      this.dialogRef.componentInstance.Confirm.subscribe( (data: IOrderItemSemplify[]) => {
        this.store.dispatch( fromActions.PlaceOrder( {payload: this.parseItemsForOrder(items) }) );
      })

    })

    this.Actions$.pipe(
      ofType(fromActions.GetItemOrderDetailsSuccess),
      map( result => Object.keys(result.payload).reduce( (acc, k) => result.payload[k] ? ({...acc, [k]: result.payload[k] }) : acc, {} )  ),
      takeUntil(this.destroy$)
    ).subscribe( (r: any) => this.dialog.open(OrderDetailComponent, {data: r}) );

    this.Actions$.pipe(
      ofType(fromActions.GetMainCoursesSuccess),
      map( ({payload}) => payload),
      tap( (d: IOrderItemLight[]) => this.storedData = d),
      takeUntil(this.destroy$)
    ).subscribe( r => this.onMenuChange(1) )

    this.Actions$.pipe(
      ofType(fromActions.PlaceOrderSuccess),
      takeUntil(this.destroy$)
    ).subscribe( r => {
      this.dialogRef && this.dialogRef.close();
      this.router.navigate(['/','app', 'welcome']) 
    });

    const Path$ = this.ChangePath$.asObservable().pipe(
      scan( (acc: any[], value) => {

        if(value) {
          console.log(value, acc);
          const res = acc.findIndex(({Descrizione}) => Descrizione === value.Descrizione );
          if(res >= 0) {
            return acc.filter((items, index) => index <= res );
          }else{
            return ([...acc, value])
          }
        }else{
          return [];
        }
      }, [] ),
      map( r => ({path: r}))
    )

    this.Sink$ = merge( of({}), this.lastState$, this.ChangeState$, this.ChangeType$, Path$ ).pipe(
      scan( (acc, curr: any) => ({...acc, ...curr}), this.initialState), 
      shareReplay(1)
    );

    this.Form.get('Search')!.valueChanges.pipe(
      tap( s => {
        if(s.length < 2) {
          this.result$.next({Layout: ELayoutType.LIST, Data: []} )
        }
      }),
      filter( (s: string) => s.length >= 3),
      debounceTime(250),
      distinctUntilChanged(),
      takeUntil( this.destroy$ )
    ).subscribe( t => this.store.dispatch( fromActions.GetSearchItems({payload: t}) )),

    this.ComponentClasses$ = this.Sink$.pipe( map( (sink: StartState) => {
      return [
        sink.collapsedList ? 'is-fullscreen' : '',
        sink.collapsed ? 'is-collapsed' : '',
        sink.search ? 'has-search-open' : 'has-search-close',
        sink.categories ? 'has-categories-open' : 'has-categories-close'
      ];

    }) );

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe( () => this.store.dispatch( fromActions.GetMainCourses() ) )
    this.store.dispatch( fromActions.SetPositionCode({payload: this.route.snapshot.params['position'] }) );
    this.Data$ = 
      this.route.data.pipe( 
        map( (d: any) => d.Data ),
        tap( () => this.storedData = this.route.snapshot.data['Data']['data'] ),
        tap( d => this.result$.next({Layout: ELayoutType.GRID, Data: d['data']}) 
      )
    );

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
