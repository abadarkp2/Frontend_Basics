// Function to handle file upload
function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csv = event.target.result;

        // Convert CSV to array of arrays
        const rows = csv.split('\n').map(row => row.split(',').map(cell => cell.trim()));

        // Process the data (e.g., display as a table)
        processStockData(rows);
    };

    reader.readAsText(file);
}

// Function to calculate percent change for a given interval
function calculatePercentChange(data, index, interval) {
    if (index < interval) return "-"; // Display "-" for the first week, first month, and first half-year

    const currentClosePrice = parseFloat(data[index][1]);
    const previousClosePrice = parseFloat(data[index - interval][1]);

    return ((currentClosePrice - previousClosePrice) / previousClosePrice) * 100;
}

// Pagination class definition
class Pagination {
    constructor(data, numOfEleToDisplayPerPage) {
        this.data = data;
        this.numOfEleToDisplayPerPage = numOfEleToDisplayPerPage;
        this.elementCount = this.data.length - 1; // Excluding header row
        this.numOfPages = Math.ceil(this.elementCount / this.numOfEleToDisplayPerPage);
        this.currentPage = 1;
        this.pages = this.createPages();
    }

    // Helper method to create pages
    createPages() {
        let pages = [];
        for (let i = 0; i < this.numOfPages; i++) {
            let start = i * this.numOfEleToDisplayPerPage + 1; // Excluding header row
            let end = start + this.numOfEleToDisplayPerPage;
            pages.push(this.data.slice(start, end));
        }
        return pages;
    }

    // Method to display a specific page
    display(pageNo) {
        if (pageNo > this.numOfPages || pageNo <= 0) {
            return -1; // Invalid page number
        } else {
            this.currentPage = pageNo;
            return this.pages[pageNo - 1];
        }
    }

    // Method to display the next page
    nextPage() {
        if (this.currentPage < this.numOfPages) {
            this.currentPage++;
            return this.pages[this.currentPage - 1];
        } else {
            return -1; // No next page
        }
    }

    // Method to display the previous page
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            return this.pages[this.currentPage - 1];
        } else {
            return -1; // No previous page
        }
    }

    // Method to display all pages
    displayAll() {
        return this.data.slice(1); // Excluding header row
    }

    // Method to change the number of elements per page
    changePageSize(newPageSize) {
        this.numOfEleToDisplayPerPage = newPageSize;
        this.numOfPages = Math.ceil(this.elementCount / this.numOfEleToDisplayPerPage);
        this.pages = this.createPages();
        this.currentPage = 1; // Reset to first page when page size changes
    }
}

// Function to process stock data and display as a table
function processStockData(data) {
    let pagination = new Pagination(data, 6); // Default number of rows per page
    displayTable(pagination.display(1)); // Display the first page

    const paginate = () => {
        const totalItems = pagination.elementCount;
        const totalPages = pagination.numOfPages;

        // Update table
        displayTable(pagination.display(pagination.currentPage));

        // Update pagination controls
        document.getElementById('pagination').innerHTML = generatePagination(totalPages, pagination);
    };

    // Generate pagination buttons
    const generatePagination = (totalPages, pagination) => {
        let paginationHtml = '<div class="pagination">';

        // Previous button
        if (pagination.currentPage > 1) {
            paginationHtml += `<button onclick="changePage('prev')">Previous</button>`;
        }

        // Page number buttons (showing 5, 10, 15, 20, All)
        for (let i = 1; i <= totalPages; i++) {
            if (i === 5 || i === 10 || i === 15 || i === 20 || i === totalPages) {
                paginationHtml += `<button onclick="changePage(${i})">${i}</button>`;
            }
        }

        // Next button
        if (pagination.currentPage < totalPages) {
            paginationHtml += `<button onclick="changePage('next')">Next</button>`;
        }

        // Page size options
        paginationHtml += `
            <select id="pageSize" onchange="changePageSize()">
            <option value="6" ${pagination.numOfEleToDisplayPerPage === 6 ? 'selected' : ''}>6</option>
            <option value="8" ${pagination.numOfEleToDisplayPerPage === 8 ? 'selected' : ''}>8</option>
                <option value="10" ${pagination.numOfEleToDisplayPerPage === 10 ? 'selected' : ''}>10</option>
                <option value="15" ${pagination.numOfEleToDisplayPerPage === 15 ? 'selected' : ''}>15</option>
                <option value="20" ${pagination.numOfEleToDisplayPerPage === 20 ? 'selected' : ''}>20</option>
                <option value="all" ${pagination.numOfEleToDisplayPerPage === 'all' ? 'selected' : ''}>All</option>
            </select>
        `;

        paginationHtml += '</div>';
        return paginationHtml;
    };

    // Change page function
    window.changePage = (page) => {
        if (page === 'next') {
            pagination.nextPage();
        } else if (page === 'prev') {
            pagination.prevPage();
        } else {
            pagination.currentPage = page;
        }
        paginate();
    };

    // Change page size function
    window.changePageSize = () => {
        const select = document.getElementById('pageSize');
        const pageSize = select.value === 'all' ? pagination.elementCount : parseInt(select.value);
        pagination.changePageSize(pageSize);
        paginate();
    };

    // Initial pagination
    paginate();
}

// Function to display table with stock data
function displayTable(pageData) {
    if (pageData === -1) return; // Invalid page

    let tableHtml = '<thead><tr><th>Date</th><th>Close Price</th><th>Daily % Change</th><th>Weekly % Change</th><th>Monthly % Change</th><th>Bi-Yearly % Change</th><th>Yearly % Change</th></tr></thead>';
    let tbodyHtml = '<tbody>';

    pageData.forEach((row, index) => {
        const [currentDate, currentClosePrice] = row;
        const closePrice = parseFloat(currentClosePrice);
        const dailyPercentChange = calculatePercentChange(pageData, index, 1);
        const weeklyPercentChange = calculatePercentChange(pageData, index,7);
        const monthlyPercentChange = calculatePercentChange(pageData, index, 30);
        const biYearlyPercentChange = calculatePercentChange(pageData, index, 182);
        const yearlyPercentChange = calculatePercentChange(pageData, index, 365);

        tbodyHtml += `<tr><td>${currentDate}</td><td>${closePrice.toFixed(2)}</td><td>${dailyPercentChange === "-" ? dailyPercentChange : dailyPercentChange.toFixed(2) + "%"}</td><td>${weeklyPercentChange === "-" ? weeklyPercentChange : weeklyPercentChange.toFixed(2) + "%"}</td><td>${monthlyPercentChange === "-" ? monthlyPercentChange : monthlyPercentChange.toFixed(2) + "%"}</td><td>${biYearlyPercentChange === "-" ? biYearlyPercentChange : biYearlyPercentChange.toFixed(2) + "%"}</td><td>${yearlyPercentChange === "-" ? yearlyPercentChange : yearlyPercentChange.toFixed(2) + "%"}</td></tr>`;
    });

    tbodyHtml += '</tbody>';
    document.getElementById('stockTable').innerHTML = tableHtml + tbodyHtml;
}

// Listen for file input change
document.getElementById('fileInput').addEventListener('change', handleFile, false);

