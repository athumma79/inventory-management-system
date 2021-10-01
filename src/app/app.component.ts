import { Component } from '@angular/core';
import { NgZone } from '@angular/core';
import * as $ from 'jquery';

import { MatDialog } from '@angular/material/dialog';
import { CarDetailsComponent } from './car-details/car-details.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public dialog: MatDialog, private ngZone: NgZone) {}

  ngOnInit() {
    let _this = this;
    $(function() {
      let inventoryData: { 
                            vin: string | null,
                            brand: string | null,
                            model: string | null,
                            color: string | null,
                            year: number | null,
                            mileage: number | null,
                            price: number | null,
                            quantity: number | null,
                            image: string | null
                        }[] = 
      [
        { 
          vin: "KNAFB1217Y5836917",
          brand: "Acura",
          model: "MDX",
          color: "White",
          year: 2008,
          mileage: 65390,
          price: 7495,
          quantity: 1,
          image: "https://2qibqm39xjt6q46gf1rwo2g1-wpengine.netdna-ssl.com/wp-content/uploads/2020/03/20736969_web1_M-2020_Acura_MDX_A-Spec_front.jpg"
        },
        { 
          vin: "JN8AZ2NF7C9539531",
          brand: "Audi",
          model: "A6",
          color: "Red",
          year: 2018,
          mileage: 25185,
          price: 39990,
          quantity: 2,
          image: "https://cdn.pocket-lint.com/r/s/1200x/assets/images/146601-cars-review-audi-a6-avant-exterior-image1-knrtkean17.jpg"
        },
        { 
          vin: "2HGEJ1125RH504045",
          brand: "Tesla",
          model: "Model 3",
          color: "Black",
          year: 2019,
          mileage: 13200,
          price: 44998,
          quantity: 4,
          image: "https://blog.vipautoaccessories.com/wp-content/uploads/2020/10/hero-1.jpg"
        },
        { 
          vin: "1N4AL2EP8DC214483",
          brand: "Honda",
          model: "Civic",
          color: "Blue",
          year: 2005,
          mileage: 95230,
          price: 5763,
          quantity: 2,
          image: "https://blogmedia.dealerfire.com/wp-content/uploads/sites/749/2018/10/2019-Honda-Civic-Coupe-Aegean-Blue-Metallic_o.jpeg"
        },
        { 
          vin: "1GC1KYE80EF172707",
          brand: "Toyota",
          model: "Corolla",
          color: "Green",
          year: 2013,
          mileage: 30195,
          price: 12990,
          quantity: 1,
          image: "https://img2.carmax.com/img/vehicles/21050064/1_cleaned.jpg?width=800"
        }
      ];
      let sortByColumnNumber: number;
      
      loadHeadingIds();
      generateTable();
  
      function loadHeadingIds() {
        let headings = document.querySelectorAll("th");
        for (let i = 0; i < headings.length; i++) {
          $(headings[i]).attr("id", "column-header-" + i);
        }
      }
  
      function generateTable() {
        $("tbody").html('');
        for (let i = 0; i < inventoryData.length; i++) {
          $("tbody").append(generateRow(inventoryData[i]));
        }
        addDeleteButtonHandlers();
        addUpdateCellHandlers();
        addRowDetailsHandlers();
        adjustHoverEffect();
        if (sortByColumnNumber != null) {
          highlightSortByColumn(sortByColumnNumber);
        }
      }
  
      function generateRow(data: any) {
        let row = '<tr>';
        for (let i = 0; i < document.querySelectorAll("th").length; i++) {
          row += '<td class="column-data-' + i + ' align-middle"';
          row += isEditable() ? ' contenteditable="true"' : '';
          row += '>';
          row += generateCellContents(data, i);
          row += '</td>';
        }
        row += '<td class="button-cell align-middle'
        row += isEditable() ? '" contenteditable="false"' : ' d-none"';
        row += '>';
        row += '<button class="btn btn-danger delete-btn"> \
                  <i class="fas fa-trash"></i> \
                </button>';
        row += '</td>';
        row += '</tr>';
        return row;
      }

      function isEditable() {
        return $('#edit-btn').hasClass('d-none');
      }
  
      function generateCellContents(data: any, i: number) {
        let row = '';
        switch (i) {
          case 0: row += data.vin || ''; break;
          case 1: row += data.brand || ''; break;
          case 2: row += data.model || ''; break;
          case 3: row += data.color || ''; break;
          case 4: row += (data.year != null) ? data.year : ''; break;
          case 5: row += (data.mileage != null) ? data.mileage.toLocaleString() : ''; break;
          case 6: row += (data.price != null) ? '$' + data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''; break;
          case 7: row += (data.quantity != null) ? data.quantity.toLocaleString() : ''; break;
        }
        return row;
      }
  
      function addDeleteButtonHandlers() {
        $(".delete-btn").off("click").click(function() {
          let rowNumber = $(this).parent().parent().parent().children().index($(this).parent().parent());
          inventoryData.splice(rowNumber, 1);
          generateTable();
        });
      }
  
      function addUpdateCellHandlers() {
        let originalCellContent: string;
        $("td").focus(function() {
          originalCellContent = $(this).text();
        });
        $("td").blur(function() {
          let rowNumber = $(this).parent().parent().children().index($(this).parent());
          let columnNumber = $(this).attr("class")?.split(' ')[0].split('-')[2];
          let cellContent = $(this).text();
          if (!validateInput(cellContent, Number(columnNumber))) {
            $(this).text(originalCellContent);
            alert("Invalid input.");
            return;
          }
          updateInventoryData(rowNumber, Number(columnNumber), cellContent);
          formatNumbersOnUpdate(rowNumber, Number(columnNumber), this)
        });
      }

      function validateInput(value: string, columnNumber: number) {
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
  
      function updateInventoryData(rowNumber: number, columnNumber: number, cellContent: string) {
        switch (columnNumber)
        {
          case 0: inventoryData[rowNumber].vin = cellContent ? cellContent.toUpperCase() : null; break;
          case 1: inventoryData[rowNumber].brand = cellContent ? cellContent : null; break;
          case 2: inventoryData[rowNumber].model = cellContent ? cellContent : null; break;
          case 3: inventoryData[rowNumber].color = cellContent ? cellContent : null; break;
          case 4: inventoryData[rowNumber].year = cellContent ? Number(cellContent) : null; break;
          case 5: inventoryData[rowNumber].mileage = cellContent ? Number(cellContent.replace(/[,]/g, '')) : null; break;
          case 6: inventoryData[rowNumber].price = cellContent ? Number(cellContent.replace(/[$,]/g, '')) : null; break;
          case 7: inventoryData[rowNumber].quantity = cellContent ? Number(cellContent.replace(/[,]/g, '')) : null; break;
        }
      }

      function formatNumbersOnUpdate(rowNumber: number, columnNumber: number, cell: any) {
        switch (columnNumber) {
          case 5: $(cell).text((inventoryData[rowNumber].mileage != null) ? Number(inventoryData[rowNumber].mileage).toLocaleString() : ''); break;
          case 6: $(cell).text((inventoryData[rowNumber].price != null) ? '$' + Number(inventoryData[rowNumber].price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''); break;
          case 7: $(cell).text((inventoryData[rowNumber].quantity != null) ? Number(inventoryData[rowNumber].quantity).toLocaleString() : ''); break;
        }
      }
  
      function addRowDetailsHandlers() {
        if (!isEditable()) {
          $("tbody tr").off("click").click(function() {
            let rowNumber = $(this).parent().children().index($(this));
            _this.ngZone.run(() => {
              _this.dialog.open(CarDetailsComponent, {
                data: { image: inventoryData[rowNumber].image },
                width: '50%'
              });
            });
          })
        }
      }

      function adjustHoverEffect() {
        isEditable() ? $("tbody tr").removeClass("hover") : $("tbody tr").addClass("hover");
      }

      function highlightSortByColumn(columnNumber: number) {
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
  
      $("#add-row-btn").click(function() {
        inventoryData.push(Object());
        generateTable();
      });
  
      $("#edit-btn").click(function() {
        $("#done-btn, .button-cell").removeClass("d-none");
        $("#edit-btn").addClass("d-none");
        $("table").removeClass("table-hover");
        $("table").addClass("table-bordered");
        adjustHoverEffect();
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
        adjustHoverEffect();
        $("td").attr({
          contenteditable: "false",
        });
        addRowDetailsHandlers();
      });
  
      $("th").click(function() {
        let columnHeaderId = $(this).attr("id");
        sortByColumnNumber = Number(columnHeaderId?.substring(
          columnHeaderId.length - 1,
          columnHeaderId.length
        ));
        let isAscending = $(this).find("i").hasClass("fa-sort-up");
        toggleSortIcon(this);
        sort(sortByColumnNumber, isAscending);
        generateTable();
      });
  
      function sort(columnNumber: number, ascending: boolean) {
        for (let i = 0; i < inventoryData.length - 1; i++) {
          for (let j = 0; j < inventoryData.length - i - 1; j++) {
            if (shouldSwap(j, columnNumber, ascending)) {
              let temp = inventoryData[j];
              inventoryData[j] = inventoryData[j + 1];
              inventoryData[j + 1] = temp;
            }
          }
        }
      }
  
      function shouldSwap(index: number, columnNumber: number, ascending: boolean) {
        let curr: any = inventoryData[index];
        let next: any = inventoryData[index + 1];
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
  
      function toggleSortIcon(_this: any) {
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
    });
  }

}
