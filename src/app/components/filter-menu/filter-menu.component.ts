import { Component, Input, OnInit } from '@angular/core';
import {
  IGlobalFilter,
  EGridColumnType,
  ISelectItem,
} from '@churchillliving/se-ui-toolkit';
import { MenuFilters } from '../grid/grid.constant';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent implements OnInit {
  public isMenuOpen: boolean = false;
  public filterOptions: ISelectItem[] = [];

  @Input() globalFilter: IGlobalFilter;
  constructor() {}

  ngOnInit(): void {
    this.filterOptions = MenuFilters[this.globalFilter.type];
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleFilterSelection({ value }: ISelectItem) {
    this.isMenuOpen = false;
    this.globalFilter.matchMode = value;
    console.log('GF', this.globalFilter);
  }
}
