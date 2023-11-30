class Table {
  constructor(_tbElement) {
    this.tbElement = _tbElement;
    this.tbSize = 5;
    this.tbID = _tbElement.dataset.gridTable;
    this.tbData = Array.from(
      document.querySelectorAll(`[data-grid-table="${this.tbID}"] tbody tr`)
    );
    this.tbDataToRender = this.tbData;

    this.tbDataSize = this.tbDataToRender.length;
    this.tbBody = document.querySelector(
      `[data-grid-table="${this.tbID}"] tbody`
    );

    this.currentPage = 1;
    this.numOfPages = Math.ceil(this.tbDataSize / this.tbSize);

    this.tbInfoElement = document.querySelector(
      `[data-grid-table-info="${this.tbID}"]`
    );

    this.tbPaginationElement = document.querySelector(
      `[data-grid-table-pagination="${this.tbID}"] div`
    );
    this.tbPrevBtn = document.querySelector(
      `[data-grid-table-pagination="${this.tbID}"] #prevBtn`
    );
    this.tbNextBtn = document.querySelector(
      `[data-grid-table-pagination="${this.tbID}"] #nextBtn`
    );

    this.tbSearchElement = document.querySelector(
      `[data-grid-table-search="${this.tbID}"]`
    );

    this.tbSortElement = document.querySelector(
      `[data-grid-table-sort="${this.tbID}"]`
    );
    this.tbSortField = document.querySelector(
      `[data-grid-table-sort="${this.tbID}"][data-grid-table-sort-by-field]`
    ).dataset.gridTableSortByField;

    if (this.tbSortElement) {
      this.tbSortElement.onchange = () => {
        this.sortTable();
      };
    }

    if (this.tbSearchElement) {
      this.tbSearchElement.onkeyup = () => {
        let searchParam = this.tbSearchElement.value.toLowerCase();
      };
    }

    if (this.tbPrevBtn) {
      this.tbPrevBtn.onclick = () => {
        this.gotoPreviousPage();
      };
    }

    if (this.tbNextBtn) {
      this.tbNextBtn.onclick = () => {
        this.gotoNextPage();
      };
    }

    this.render();
  }

  renderTableInfo() {
    return (this.tbInfoElement.innerHTML = `Showing ${this.tbSize} of ${this.tbDataSize} data`);
  }

  renderTableBody() {
    let nextDataIsMoreThanPageSize =
      this.tbDataToRender.slice((this.currentPage - 1) * this.tbSize).length >
      this.tbSize;

    this.tbBody.innerHTML = "";

    if (nextDataIsMoreThanPageSize) {
      this.tbDataToRender
        .slice(
          (this.currentPage - 1) * this.tbSize,
          (this.currentPage - 1) * this.tbSize + this.tbSize
        )
        .forEach((data) => {
          this.tbBody.appendChild(data);
        });
    } else {
      this.tbDataToRender
        .slice((this.currentPage - 1) * this.tbSize)
        .forEach((data) => {
          this.tbBody.appendChild(data);
        });
    }
  }

  renderTablePagination() {
    if (this.tbPaginationElement) {
      this.tbPaginationElement.innerHTML = "";

      let result = `
      ${this.generatePaginationArray()
        .map((pageNum) => {
          return `<li class="fv-pagination-num ${
            this.currentPage === pageNum && "fv-pagination-current"
          }">${pageNum}</li>`;
        })
        .toString()
        .replaceAll(",", "")}
      `;

      this.tbPaginationElement.innerHTML = result;

      // select all li and add click events
      let pageLis = document.querySelectorAll(
        `[data-grid-table-pagination="${this.tbID}"] div li`
      );

      pageLis.forEach((li) => {
        li.onclick = () => {
          this.jumpToPage(Number(li.innerHTML));
        };
      });
    }
  }

  range(start, stop, step) {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  }

  generatePaginationArray() {
    const paginationArr = this.range(1, this.numOfPages, 1);
    let paginationArrToRender;

    if (paginationArr.length < 5) {
      paginationArrToRender = paginationArr;
    } else {
      let scopedArr = paginationArr.slice(
        paginationArr.indexOf(this.currentPage)
      );
      if (scopedArr.length < 4) {
        paginationArrToRender = paginationArr.slice(-4);
      } else {
        paginationArrToRender = scopedArr.slice(0, 4);
      }
    }

    return paginationArrToRender;
  }

  render() {
    this.renderTableInfo();
    this.renderTableBody();
    this.renderTablePagination();
  }

  gotoPreviousPage() {
    if (this.currentPage > 1) this.currentPage--;
    this.render();
  }

  gotoNextPage() {
    if (this.currentPage * this.tbSize < this.tbDataSize) this.currentPage++;
    this.render();
  }

  jumpToPage(pageNum) {
    this.currentPage = pageNum;
    this.render();
  }

  sortTable() {
    const tbHeads = Array.from(
      document.querySelectorAll(`[data-grid-table="${this.tbID}"] thead tr th`)
    );
    let indexOfSortField;
    const selectedSortParam = this.tbSortElement.value;

    tbHeads.forEach((head) => {
      if (this.tbSortField == head.dataset.gridTableField) {
        indexOfSortField = tbHeads.indexOf(head);
      }
    });

    for (let i; i < this.tbData.length; i++) {
      console.log("first");
      console.log(
        this.tbData[i].children[indexOfSortField].textContent.toLowerCase()
      );
    }

    // let filteredData = this.tbData.filter((tbItem) => {
    //   console.log(
    //     `${selectedSortParam} and ${tbItem.children[
    //       indexOfSortField
    //     ].textContent.toLowerCase()}`
    //   );
    //   return (
    //     selectedSortParam ==
    //     tbItem.children[indexOfSortField].textContent.toLowerCase()
    //   );
    // });

    // console.log(filteredData);
  }
}

// initialize all tables with data-grid-table attribute
const allTables = document.querySelectorAll("[data-grid-table]");

allTables.forEach((tb) => {
  let table = new Table(tb);
});
