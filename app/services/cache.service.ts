import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class FakeCache {
  CACHE_NAME = "auth";
  TOKEN_KEY = "token";
  FAKE_TOKEN = "sRKWQu6hCJgR25lslcf5s12FFVau0ugi";
  // Cache Storage was designed for caching
  // network requests with service workers,
  // mainly to make PWAs work offline.
  // You can give it any value you want in this case.
  FAKE_ENDPOINT = "/fake-endpoint";
  saveToken = async (token: string) => {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      const responseBody = JSON.stringify({
        [this.TOKEN_KEY]: token
      });
      const response = new Response(responseBody);
      await cache.put(this.FAKE_ENDPOINT, response);
      // console.log("Token saved! 🎉");
    } catch (error) {
      // It's up to you how you resolve the error
      // console.log("saveToken error:", { error });
    }
  };

  getToken = async () => {
    try {
      const cache = await caches.open(this.CACHE_NAME);
      const response = await cache.match(this.FAKE_ENDPOINT);

      if (!response) {
        return null;
      }

      const responseBody = await response.json();
      return responseBody[this.TOKEN_KEY];
    } catch (error) {
      // Gotta catch 'em all
      // console.log("getToken error:", { error });
    }
  };

  displayCachedToken = async () => {
    const cachedToken = await this.getToken();
    // console.log({ cachedToken });
  };

  // Uncomment the line below to save the fake token
  // saveToken(FAKE_TOKEN);

  // displayCachedToken();

}


