export const enum RouterPage {
  Task = "Task",
  Results = "Results",
}

type RouteParams = {
  [RouterPage.Task]: { taskId: number };
  [RouterPage.Results]: undefined;
};

type Page<T extends RouterPage = RouterPage> = {
  name: T;
  url: string;
};

const routes: ReadonlyArray<Page> = [
  {
    name: RouterPage.Task,
    url: "/task/:taskId",
  },
  {
    name: RouterPage.Results,
    url: "/results",
  },
] as const;

export class RouterService {
  constructor(handleNavigate: (e: PopStateEvent) => void) {
    window.addEventListener("popstate", handleNavigate);
  }

  private buildUrl(url: string, params: Record<string, string | number> = {}) {
    const match: string[] = url.match(/:[^\/]+/g) || [];

    return match.reduce((url, placeholder) => {
      const paramKey = placeholder.substring(1);

      if (!params.hasOwnProperty(paramKey)) {
        throw Error(`Missing required param: ${paramKey}`);
      }

      return url.replace(placeholder, params[paramKey].toString());
    }, url);
  }

  goTo<T extends RouterPage>(routeName: T, params?: RouteParams[T]) {
    const route = routes.find((route) => route.name === routeName);

    if (!route) {
      return;
    }

    history.pushState(params, "", this.buildUrl(route.url, params));
  }

  getCurrentRouteName(): RouterPage | undefined {
    for (const route of routes) {
      // For simplicity, replace path parameters with a wildcard regex
      // This will match /task/anythingHere to /task/:taskId
      const regex = new RegExp(
        "^" + route.url.replace(/:[^\s/]+/g, "([^\\s\\/]+)") + "$",
      );

      if (regex.test(location.pathname)) {
        return route.name;
      }
    }

    return undefined;
  }
}
