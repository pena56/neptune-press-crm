// set Table Size
const TABLE_SIZE = 5;
let currentPage = 1;

// select all table with attribute data-grid-table
const allTables = document.querySelectorAll("[data-grid-table]");

allTables.forEach((tb) => {
  const TABLE_ID = tb.dataset.gridTable;
  const TABLE_DATA = Array.from(
    document.querySelectorAll(`[data-grid-table="${TABLE_ID}"] tbody tr`)
  );
  const TABLE_DATA_SIZE = TABLE_DATA.length;
  const NUM_OF_PAGES = Math.ceil(TABLE_DATA_SIZE / TABLE_SIZE);

  let tableBody = document.querySelector(
    `[data-grid-table="${TABLE_ID}"] tbody`
  );

  //   select table info
  const tableInfo = document.querySelector(
    `[data-grid-table-info="${TABLE_ID}"]`
  );

  //   select table pagination
  const tablePagination = document.querySelector(
    `[data-grid-table-pagination="${TABLE_ID}"]`
  );

  //   select table search
  const tableSearch = document.querySelector(
    `[data-grid-table-search="${TABLE_ID}"]`
  );

  //   select table sort
  const tableSort = document.querySelector(
    `[data-grid-table-sort="${TABLE_ID}"]`
  );

  function previousPage() {
    if (currentPage > 1) currentPage--;
    renderTableData(tableBody, TABLE_DATA.slice(currentPage - 1, TABLE_SIZE));
    renderTablePagination(
      tablePagination,
      generatePaginationArray(NUM_OF_PAGES, currentPage)
    );
  }

  function nextPage() {
    if (currentPage * TABLE_SIZE < TABLE_DATA.length) currentPage++;
    renderTableData(tableBody, TABLE_DATA.slice(currentPage - 1, TABLE_SIZE));
    renderTablePagination(
      tablePagination,
      generatePaginationArray(NUM_OF_PAGES, currentPage)
    );
  }

  renderTableInfo(tableInfo, TABLE_SIZE, TABLE_DATA_SIZE);
  renderTableData(tableBody, TABLE_DATA.slice(currentPage - 1, TABLE_SIZE));
  renderTablePagination(
    tablePagination,
    generatePaginationArray(NUM_OF_PAGES, currentPage)
  );
});

// helper functions
function renderTableInfo(tbInfoElement, tbSize, tbDataSize) {
  return (tbInfoElement.innerHTML = `Showing ${tbSize} of ${tbDataSize} data`);
}

function renderTableData(tbBodyElement, tbData) {
  tbBodyElement.innerHTML = "";
  tbData.forEach((data) => {
    tbBodyElement.appendChild(data);
  });
}

function renderTablePagination(tbPaginationElement, paginationArr) {
  tbPaginationElement.innerHTML = "";
  let result = `
    <li id="prevButton" onclick="previousPage()" class="fv-pagination-icons">
    <span class="material-icons fv-pagination-icon">
      chevron_left
    </span>
    <span class="material-icons fv-pagination-icon-left">
      chevron_left
    </span>
  </li>

    ${paginationArr
      .map((pageNum) => {
        return `<li class="fv-pagination-num ${
          currentPage === pageNum && "fv-pagination-current"
        }">${pageNum}</li>`;
      })
      .toString()
      .replaceAll(",", "")}

  <li id="nextButton" onclick="nextPage()" class="fv-pagination-icons">
    <span class="material-icons fv-pagination-icon">
      chevron_right
    </span>
    <span class="material-icons fv-pagination-icon-right">
      chevron_right
    </span>
  </li>
    `;

  tbPaginationElement.innerHTML = result;
}

function range(start, stop, step) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}

function generatePaginationArray(numPages, currPage) {
  const paginationArr = range(1, numPages, 1);
  let paginationArrToRender;

  if (paginationArr.length < 5) {
    paginationArrToRender = paginationArr;
  } else {
    let scopedArr = paginationArr.slice(paginationArr.indexOf(currPage));
    if (scopedArr.length < 4) {
      paginationArrToRender = paginationArr.slice(-4);
    } else {
      paginationArrToRender = scopedArr.slice(0, 4);
    }
  }

  return paginationArrToRender;
}

// function previousPage() {
//     if (currentPage > 1) currentPage--;
//     renderTableData();
//     renderPagination();
//   }

//   function nextPage() {
//     if (currentPage * TABLE_SIZE < data.length) currentPage++;
//     renderTableData();
//     renderPagination();
//   }
