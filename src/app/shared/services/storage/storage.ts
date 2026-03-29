export class Storage {

  public static Set<T>(index: string, item: T) {
    const s = JSON.stringify(item);
    localStorage.setItem(index, s);
  }

  public static Clear(index: string) {
    localStorage.removeItem(index);
  }
/* get from local storage */
  public static Get<T extends object>(index: string, exp: new () => T): T | null {
    const item = localStorage.getItem(index);

    if (item === undefined || item == null) {
      return null;
    }

    try {
      const d: T = new exp();
      const ob = JSON.parse(item);
      Object.assign(d, ob);

      return d;

    } catch (e) {
      return null;
    }
  }

  /* get from session storage */
  public static GetFromSession<T extends object>(index: string, exp: new () => T): T | null {
    const item = sessionStorage.getItem(index);

    if (item === undefined || item == null) {
      return null;
    }

    try {
      const d: T = new exp();
      const ob = JSON.parse(item);
      Object.assign(d, ob);

      return d;

    } catch (e) {
      return null;
    }
  }
}
