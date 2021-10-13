import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as $ from 'jquery';

import { MatDialog } from '@angular/material/dialog';
import { CarDetailsComponent } from './car-details/car-details.component';

import { Car } from './models/car';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  inventoryData: Car[] = new Array();
  sortByColumnNumber: number | null = null;
  currentPage: number = 1;
  rowsPerPage: number = 3;

  constructor(
    private httpClient: HttpClient, 
    public dialog: MatDialog, 
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.populateInventoryData();

    let _this = this;
    $(function() {
      _this.loadHeadingIds();
      _this.generateTable();

      $("#add-row-btn").click(function() {
        _this.inventoryData.push(new Car());
        _this.goToLastPage();
        _this.generateTable();
      });

      $("#edit-btn").click(function() {
        $("#done-btn, .button-cell").removeClass("d-none");
        $("#edit-btn").addClass("d-none");
        $("table").removeClass("table-hover");
        $("table").addClass("table-bordered");
        _this.adjustHoverEffect();
        $("td").attr({
          contenteditable: "true",
        });
        $(".button-cell").attr({
          contenteditable: "false",
        });
        $("tbody tr").off("click");
      });

      $("#done-btn").click(function() {
        $("#done-btn, .button-cell").addClass("d-none");
        $("#edit-btn").removeClass("d-none");
        $("table").addClass("table-hover");
        $("table").removeClass("table-bordered");
        _this.adjustHoverEffect();
        $("td").attr({
          contenteditable: "false",
        });
        _this.addRowDetailsHandlers();
      });

      $("th").click(function() {
        let columnHeaderId = $(this).attr("id");
        _this.sortByColumnNumber = Number(columnHeaderId?.substring(
          columnHeaderId.length - 1,
          columnHeaderId.length
        ));
        let isAscending = $(this).find("i").hasClass("fa-sort-up");
        _this.toggleSortIcon(this);
        _this.sort(_this.sortByColumnNumber, isAscending);
        _this.generateTable();
      });

      $("#searchbar-field").keyup((event) => {
        if(event.key == "Enter") {
          _this.searchInputHandler();
        }
      })

      $("#search-btn").click(() => _this.searchInputHandler());

      $("#clear-search-btn").click(function() {
        $("#searchbar-field").val("");
        _this.setAllRowsToSearchVisible();
        _this.generateTable();
      });

      $("#next-page-btn").click(function() {
        if (!_this.isPageOnTopEdgeOfBounds()) {
          _this.currentPage++;
          _this.generateTable();
        }
      });

      $("#prev-page-btn").click(function() {
        if (!_this.isPageOnBottomEdgeOfBounds()) {
          _this.currentPage--;
          _this.generateTable();
        }
      });

      $("#rows-per-page-field")
        .change(() => _this.rowsPerPageInputHandler())
        .keyup(() => _this.rowsPerPageInputHandler());
    });
  }

  populateInventoryData() {
    this.httpClient.get("assets/dummy-data.json").subscribe((data: any) => {
      for (let i = 0; i < data.cars.length; i++) {
        let newCar = new Car();
  
        newCar.vin = data.cars[i].vin;
        newCar.brand = data.cars[i].brand;
        newCar.model = data.cars[i].model;
        newCar.color = data.cars[i].color;
        newCar.year = Number(data.cars[i].year);
        newCar.mileage = Number(data.cars[i].mileage);
        newCar.price = Number(data.cars[i].price);
        newCar.quantity = Number(data.cars[i].quantity);
        newCar.image = data.cars[i].image;
  
        this.inventoryData.push(newCar);
      }
    })
  }

  loadHeadingIds() {
    let headings = document.querySelectorAll("th");
    for (let i = 0; i < headings.length; i++) {
      $(headings[i]).attr("id", "column-header-" + i);
    }
  }

  generateTable() {
    this.updatePagination();
    $("tbody").html('');
    for (let i = 0; i < this.inventoryData.length; i++) {
      if (this.inventoryData[i].toDisplaySearch && this.inventoryData[i].toDisplayPage) {
        $("tbody").append(this.generateRow(this.inventoryData[i]));
      }
    }
    this.addDeleteButtonHandlers();
    this.addUpdateCellHandlers();
    this.addRowDetailsHandlers();
    this.adjustHoverEffect();
    if (this.sortByColumnNumber != null) {
      this.highlightSortByColumn(this.sortByColumnNumber);
    }
  }

  generateRow(data: any) {
    let row = '<tr>';
    for (let i = 0; i < document.querySelectorAll("th").length; i++) {
      row += '<td class="column-data-' + i + ' align-middle"';
      row += this.isEditable() ? ' contenteditable="true"' : '';
      row += '>';
      row += this.generateCellContents(data, i);
      row += '</td>';
    }
    row += '<td class="button-cell align-middle'
    row += this.isEditable() ? '" contenteditable="false"' : ' d-none"';
    row += '>';
    row += '<button class="btn btn-danger delete-btn"> \
              <i class="fas fa-trash"></i> \
            </button>';
    row += '</td>';
    row += '</tr>';
    return row;
  }

  generateCellContents(data: any, i: number) {
    let cell = '';
    switch (i) {
      case 0: cell += data.vin || ''; break;
      case 1: cell += data.brand || ''; break;
      case 2: cell += data.model || ''; break;
      case 3: cell += data.color || ''; break;
      case 4: cell += (data.year != null) ? data.year : ''; break;
      case 5: cell += (data.mileage != null) ? data.mileage.toLocaleString() : ''; break;
      case 6: cell += (data.price != null) ? '$' + data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''; break;
      case 7: cell += (data.quantity != null) ? data.quantity.toLocaleString() : ''; break;
    }
    return cell;
  }

  addRowDetailsHandlers() {
    if (!this.isEditable()) {
      let _this = this;
      $("tbody tr").off("click").click(function() {
        let rowNumber = $(this).parent().children().index($(this));
        _this.ngZone.run(() => {
          let dialogRef = _this.dialog.open(CarDetailsComponent, {
            data: { image: _this.inventoryData[rowNumber].image },
            width: '50%'
          });
          dialogRef.afterClosed().subscribe((image) => {
            _this.inventoryData[rowNumber].image = image;
          });
        });
      })
    }
  }

  addUpdateCellHandlers() {
    let originalCellContent: string;
    $("td").focus(function() {
      originalCellContent = $(this).text();
    });
    let _this = this;
    $("td").blur(function() {
      let rowNumber = $(this).parent().parent().children().index($(this).parent());
      let columnNumber = $(this).attr("class")?.split(' ')[0].split('-')[2];
      let cellContent = $(this).text();
      if (!_this.validateInput(cellContent, Number(columnNumber))) {
        $(this).text(originalCellContent);
        alert("Invalid input.");
        return;
      }
      _this.updateInventoryData(rowNumber, Number(columnNumber), cellContent);
      _this.formatNumbersOnUpdate(rowNumber, Number(columnNumber), this)
    });
  }

  validateInput(value: string, columnNumber: number) {
    if (value == '') {
      return true;
    }
    let regex;
    switch (columnNumber) {
      case 0: regex = /^[a-zA-Z\d]{17}$/; break;
      case 1: case 2: regex = /^[a-zA-Z\d ]*$/; break;
      case 3: regex = /^[a-zA-Z ]*$/; break;
      case 4: regex = /^([1-2]\d{3})$/; break;
      case 5: case 7: regex = /^(\d+|\d{1,3}(,\d{3})*)$/; break;
      case 6: regex = /^(\$?(\d+|\d{1,3}(,\d{3})*)(\.\d{2})?)$/; break;
    }
    return regex?.test(value);
  }

  updateInventoryData(rowNumber: number, columnNumber: number, cellContent: string) {
    switch (columnNumber)
    {
      case 0: this.inventoryData[rowNumber].vin = cellContent ? cellContent.toUpperCase() : null; break;
      case 1: this.inventoryData[rowNumber].brand = cellContent ? cellContent : null; break;
      case 2: this.inventoryData[rowNumber].model = cellContent ? cellContent : null; break;
      case 3: this.inventoryData[rowNumber].color = cellContent ? cellContent : null; break;
      case 4: this.inventoryData[rowNumber].year = cellContent ? Number(cellContent) : null; break;
      case 5: this.inventoryData[rowNumber].mileage = cellContent ? Number(cellContent.replace(/[,]/g, '')) : null; break;
      case 6: this.inventoryData[rowNumber].price = cellContent ? Number(cellContent.replace(/[$,]/g, '')) : null; break;
      case 7: this.inventoryData[rowNumber].quantity = cellContent ? Number(cellContent.replace(/[,]/g, '')) : null; break;
    }
  }

  formatNumbersOnUpdate(rowNumber: number, columnNumber: number, cell: any) {
    switch (columnNumber) {
      case 5:
        $(cell).text(
          (this.inventoryData[rowNumber].mileage != null) ? 
          Number(this.inventoryData[rowNumber].mileage).toLocaleString() : 
          ''
        );
        break;
      case 6:
        $(cell).text(
          (this.inventoryData[rowNumber].price != null) ? 
          '$' + Number(this.inventoryData[rowNumber].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) :
          ''
        );
        break;
      case 7:
        $(cell).text(
          (this.inventoryData[rowNumber].quantity != null) ? 
          Number(this.inventoryData[rowNumber].quantity).toLocaleString() :
          ''
        );
        break;
    }
  }

  addDeleteButtonHandlers() {
    let _this = this;
    $(".delete-btn").off("click").click(function() {
      let rowNumber = $(this).parent().parent().parent().children().index($(this).parent().parent());
      _this.inventoryData.splice(rowNumber, 1);
      if (_this.isPageEmpty() && _this.currentPage > 1) {
        _this.currentPage--;
      }
      _this.generateTable();
    });
  }

  sort(columnNumber: number, ascending: boolean) {
    for (let i = 0; i < this.inventoryData.length - 1; i++) {
      for (let j = 0; j < this.inventoryData.length - i - 1; j++) {
        if (this.shouldSwap(j, columnNumber, ascending)) {
          let temp = this.inventoryData[j];
          this.inventoryData[j] = this.inventoryData[j + 1];
          this.inventoryData[j + 1] = temp;
        }
      }
    }
  }

  shouldSwap(index: number, columnNumber: number, ascending: boolean) {
    let curr: any = this.inventoryData[index];
    let next: any = this.inventoryData[index + 1];
    switch (columnNumber) {
      case 0: curr = curr.vin; next = next.vin; break;
      case 1: curr = curr.brand; next = next.brand; break;
      case 2: curr = curr.model; next = next.model; break;
      case 3: curr = curr.color; next = next.color; break;
      case 4: curr = curr.year; next = next.year; break;
      case 5: curr = curr.mileage; next = next.mileage; break;
      case 6: curr = curr.price; next = next.price; break;
      case 7: curr = curr.quantity; next = next.quantity; break;
    }
    if (columnNumber < 4) {
      curr = curr ? curr.toLowerCase() : NaN;
      next = next ? next.toLowerCase() : NaN;
    }
    else {
      curr = curr ? Number(curr) : NaN;
      next = next ? Number(next) : NaN;
    }
    return ascending ? curr > next : curr < next;
  }

  highlightSortByColumn(columnNumber: number) {
    document.querySelectorAll("th").forEach(function(header) {
      $(header).removeClass("sort-by-header");
    });
    $("#column-header-" + columnNumber).addClass("sort-by-header");
    document.querySelectorAll("td").forEach(function(cell) {
      $(cell).removeClass("sort-by-cell");
    });
    document.querySelectorAll(".column-data-" + columnNumber).forEach(function(cell) {
      $(cell).addClass("sort-by-cell");
    });
  }

  toggleSortIcon(_this: any) {
    if ($(_this).find("i").hasClass("fa-sort")) {
      document.querySelectorAll(".sort-icon").forEach(function(header) {
        $(header)
          .addClass("fa-sort")
          .removeClass("fa-sort-up")
          .removeClass("fa-sort-down");
      });
      $(_this).find("i").removeClass("fa-sort").addClass("fa-sort-up");
    } else {
      $(_this)
        .find("i")
        .toggleClass("fa-sort-up")
        .toggleClass("fa-sort-down");
    }
  }

  setRowVisibilityBySearch(searchValue: string) {
    this.setAllRowsToSearchVisible();
    if (searchValue.trim().length == 0) {
      return;
    }
    for (let i = 0; i < this.inventoryData.length; i++) {
      if (!this.inventoryData[i].contains(searchValue)) {
        this.inventoryData[i].toDisplaySearch = false;
      }
    }
  }

  setAllRowsToSearchVisible() {
    for (let i = 0; i < this.inventoryData.length; i++) {
      this.inventoryData[i].toDisplaySearch = true;
    }
  }

  searchInputHandler() {
    this.setRowVisibilityBySearch($("#searchbar-field").val() as string);
    this.generateTable();
  }

  updatePagination() {
    $("#current-page").text(this.currentPage);
    $("#rows-per-page-field").val(this.rowsPerPage);
    $("#prev-page-btn").removeAttr("disabled");
    $("#next-page-btn").removeAttr("disabled");
    if (this.isPageOnBottomEdgeOfBounds()) {
      $("#prev-page-btn").attr("disabled", "disabled");
    }
    if (this.isPageOnTopEdgeOfBounds()) {
      $("#next-page-btn").attr("disabled", "disabled");
    }
    this.setRowVisibilityByPage();
  }

  setRowVisibilityByPage() {
    this.setAllRowsToPageVisible();
    for (let i = 0, k = 0; i < this.inventoryData.length; i++) {
      if (k < this.getFirstItemOnPage() || k > this.getLastItemOnPage()) {
        this.inventoryData[i].toDisplayPage = false;
      }
      if (this.inventoryData[i].toDisplaySearch) {
        k++;
      }
    } 
  }

  setAllRowsToPageVisible() {
    for (let i = 0; i < this.inventoryData.length; i++) {
      this.inventoryData[i].toDisplayPage = true;
    }
  }

  rowsPerPageInputHandler() {
    let input = Number($("#rows-per-page-field").val());
    if (input > 0) {
      this.rowsPerPage = input;
      if (this.isPageEmpty() && this.currentPage > 1) {
        this.currentPage--;
      }
      this.generateTable();
    }
  }

  goToLastPage() {
    this.currentPage = Math.ceil(this.getEnabledInventoryCount() / this.rowsPerPage);
  }

  isPageEmpty() {
    return this.currentPage > Math.ceil(this.getEnabledInventoryCount() / this.rowsPerPage);
  }

  getFirstItemOnPage() {
    return (this.currentPage - 1) * this.rowsPerPage;
  }

  getLastItemOnPage() {
    return this.getFirstItemOnPage() + this.rowsPerPage - 1;
  }

  isPageOnBottomEdgeOfBounds() {
    return this.currentPage <= 1;
  }

  isPageOnTopEdgeOfBounds() {
    return this.getLastItemOnPage() >= (this.getEnabledInventoryCount() - 1);
  }

  getEnabledInventoryCount() {
    let count = 0;
    for (let i = 0; i < this.inventoryData.length; i++) {
      if (this.inventoryData[i].toDisplaySearch) {
        count++;
      }
    }
    return count;
  }

  adjustHoverEffect() {
    this.isEditable() ? $("tbody tr").removeClass("hover") : $("tbody tr").addClass("hover");
  }

  isEditable() {
    return $('#edit-btn').hasClass('d-none');
  }

}
