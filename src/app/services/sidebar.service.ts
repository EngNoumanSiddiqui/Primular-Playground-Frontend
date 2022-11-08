import { Injectable } from '@angular/core';
import { IMenu } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  constructor() {}

  /**
   * Checks parent menu and expands it if current route exists in its child menus.
   * @param menuLabel
   * @returns {boolean}
   */
  isMenuExpanded(
    currentRoute: string,
    items: IMenu[],
    menuLabel: string
  ): boolean {
    if (items && items.length) {
      const currentIndex = items.findIndex(
        (menu) => menu.label?.toLowerCase() === menuLabel?.toLowerCase()
      );
      let matchedItems = items[currentIndex]?.items;
      currentRoute = currentRoute.includes('?')
        ? currentRoute.split('?')[0]
        : currentRoute;
      const detailPage = currentRoute.replace('list', 'detail');
      return matchedItems
        ? matchedItems.some(
            (item: any) =>
              item.routerLink &&
              (currentRoute === item.routerLink[0] ||
                currentRoute === detailPage)
          )
        : false;
    }
    return false;
  }
}
