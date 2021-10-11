import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
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

  constructor(public dialog: MatDialog, private ngZone: NgZone) {}

  ngOnInit() {
    this.populateInventoryData();

    let _this = this;
    $(function() {
      _this.loadHeadingIds();
      _this.generateTable();

      $("#add-row-btn").click(function() {
        _this.inventoryData.push(new Car());
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
    });
  }

  populateInventoryData() {
    for (let i = 0; i < 5; i++) {
      this.inventoryData.push(new Car());
    }

    this.inventoryData[0].vin = "KNAFB1217Y5836917";
    this.inventoryData[0].brand = "Acura";
    this.inventoryData[0].model = "MDX";
    this.inventoryData[0].color = "White";
    this.inventoryData[0].year = 2008;
    this.inventoryData[0].mileage = 65390;
    this.inventoryData[0].price = 7495;
    this.inventoryData[0].quantity = 1;
    this.inventoryData[0].image = "https://2qibqm39xjt6q46gf1rwo2g1-wpengine.netdna-ssl.com/wp-content/uploads/2020/03/20736969_web1_M-2020_Acura_MDX_A-Spec_front.jpg";

    this.inventoryData[1].vin = "JN8AZ2NF7C9539531";
    this.inventoryData[1].brand = "Audi";
    this.inventoryData[1].model = "A6";
    this.inventoryData[1].color = "Red";
    this.inventoryData[1].year = 2018;
    this.inventoryData[1].mileage = 25185;
    this.inventoryData[1].price = 39990;
    this.inventoryData[1].quantity = 2;
    this.inventoryData[1].image = "https://cdn.pocket-lint.com/r/s/1200x/assets/images/146601-cars-review-audi-a6-avant-exterior-image1-knrtkean17.jpg";

    this.inventoryData[2].vin = "2HGEJ1125RH504045";
    this.inventoryData[2].brand = "Tesla";
    this.inventoryData[2].model = "Model 3";
    this.inventoryData[2].color = "Black";
    this.inventoryData[2].year = 2019;
    this.inventoryData[2].mileage = 13200;
    this.inventoryData[2].price = 44998;
    this.inventoryData[2].quantity = 4;
    this.inventoryData[2].image = "https://blog.vipautoaccessories.com/wp-content/uploads/2020/10/hero-1.jpg";

    this.inventoryData[3].vin = "1N4AL2EP8DC214483";
    this.inventoryData[3].brand = "Honda";
    this.inventoryData[3].model = "Civic";
    this.inventoryData[3].color = "Blue";
    this.inventoryData[3].year = 2005;
    this.inventoryData[3].mileage = 95230;
    this.inventoryData[3].price = 5763;
    this.inventoryData[3].quantity = 2;
    this.inventoryData[3].image = "https://blogmedia.dealerfire.com/wp-content/uploads/sites/749/2018/10/2019-Honda-Civic-Coupe-Aegean-Blue-Metallic_o.jpeg";

    this.inventoryData[4].vin = "1GC1KYE80EF172707";
    this.inventoryData[4].brand = "Toyota";
    this.inventoryData[4].model = "Corolla";
    this.inventoryData[4].color = "Green";
    this.inventoryData[4].year = 2013;
    this.inventoryData[4].mileage = 30195;
    this.inventoryData[4].price = 12990;
    this.inventoryData[4].quantity = 1;
    this.inventoryData[4].image = "https://img2.carmax.com/img/vehicles/21050064/1_cleaned.jpg?width=800";
  }

  loadHeadingIds() {
    let headings = document.querySelectorAll("th");
    for (let i = 0; i < headings.length; i++) {
      $(headings[i]).attr("id", "column-header-" + i);
    }
  }

  generateTable() {
    let _this = this;
    $("tbody").html('');
    for (let i = 0; i < _this.inventoryData.length; i++) {
      $("tbody").append(_this.generateRow(_this.inventoryData[i]));
    }
    _this.addDeleteButtonHandlers();
    _this.addUpdateCellHandlers();
    _this.addRowDetailsHandlers();
    _this.adjustHoverEffect();
    if (_this.sortByColumnNumber != null) {
      _this.highlightSortByColumn(_this.sortByColumnNumber);
    }
  }

  generateRow(data: any) {
    let _this = this;
    let row = '<tr>';
    for (let i = 0; i < document.querySelectorAll("th").length; i++) {
      row += '<td class="column-data-' + i + ' align-middle"';
      row += _this.isEditable() ? ' contenteditable="true"' : '';
      row += '>';
      row += _this.generateCellContents(data, i);
      row += '</td>';
    }
    row += '<td class="button-cell align-middle'
    row += _this.isEditable() ? '" contenteditable="false"' : ' d-none"';
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
    let _this = this;
    if (!_this.isEditable()) {
      $("tbody tr").off("click").click(function() {
        let rowNumber = $(this).parent().children().index($(this));
        _this.ngZone.run(() => {
          _this.dialog.open(CarDetailsComponent, {
            data: { image: _this.inventoryData[rowNumber].image },
            width: '50%'
          });
        });
      })
    }
  }

  addUpdateCellHandlers() {
    let _this = this;
    let originalCellContent: string;
    $("td").focus(function() {
      originalCellContent = $(this).text();
    });
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
      curr = curr ? curr.toLowerCase() : 0;
      next = next ? next.toLowerCase() : 0;
    }
    else {
      curr = Number(curr);
      next = Number(next);
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

  adjustHoverEffect() {
    let _this = this;
    _this.isEditable() ? $("tbody tr").removeClass("hover") : $("tbody tr").addClass("hover");
  }

  isEditable() {
    return $('#edit-btn').hasClass('d-none');
  }

}
