/// <reference path="jquery-3.6.1.js" />

"use strict";

$(async () => {

    $(document).ready(handleCurrencies);

    // While clicking the 'Currencies' link:
    $("#currenciesLink").click(handleCurrencies);

    // While clicking the 'Reports' link:
    $("#reportsLink").click(handleReports);

    // While clicking the 'About' link:
    $("#aboutLink").click(handleAbout);

    // While clicking the 'Search' button:
    $("#searchButton").click(handleSearch);

    // While clicking the 'Delete' button:
    $("#deleteButton").click(() => {
        $("#searchInput").val("");
    });

    //close modal 
    $(window).on('click', function (event) {
        checkEventTarget(event);
    });
    function checkEventTarget(event) {
        if (event.target === document.getElementById('alert-modal')) {
            $('#alert-modal').fadeOut();
        }
    }
    $("#closeModal").click(function () {
        $('#alert-modal').fadeOut();
    })

    // Currencies:
    async function handleCurrencies() {
        const coins = await getJson("https://api.coingecko.com/api/v3/coins");
        displayCoins(coins);
    }

    // Search:
    async function handleSearch() {
        const coins = await getJson("https://api.coingecko.com/api/v3/coins");
        const searchArr = [];
        const searchVal = $("#searchInput").val();
        if (searchVal === "") {
            alert("No value has been insert, please write value for search");
            return;
        }
        for (const coin of coins) {
            if ((coin.symbol).toLowerCase() === (searchVal).toLowerCase()) {
                searchArr.push(coin);
            }
        }
        if (searchArr.length > 0) {
            displayCoins(searchArr);
        }
        else {
            $("#contentDiv").html(`No result found for "${searchVal}"`);
        }
        $("#searchInput").val("");
        updateCoinsBySessionStorage();
    }

    // Display coins function:
    function displayCoins(coins) {
        let coinData = "";
        for (const coin of coins) {
            coinData += `
                <div data-id="${coin.id}" class="card ${coin.id}">
                    <div class="form-check form-switch" id="switchButtonDiv">
                        <img src="${coin.image.small}" id="coinImg">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                    <div class="coinSymbol">
                    ${coin.symbol}
                    </div>
                    <div class="coinName">
                    ${coin.name}
                    </div>
                    <button class="btn btn-primary ladda" id="moreInfoButton" data-bs-toggle="collapse" data-bs-target="#${coin.id}">
                        <span class="buttonTextSpan">More Info<span>
                    </button>
                    <div class="collapse" id="${coin.id}">
                        <div class="card-body" id="loading">
                            <div class="spinner-border-hidden" role="status">
                            <span class="sr-only"></span>
                        </div>
                        <span id="conversion">conversion</span><br>
                        ${coin.market_data.current_price.usd}$<br>
                        ${coin.market_data.current_price.eur}€<br>
                        ${coin.market_data.current_price.ils}₪
                    </div>
                </div>
                </div>
                `;
        }
        $("#contentDiv").html(coinData);
        updateCoinsBySessionStorage();
        $('input[type=checkbox]').on('change', function (e) {
            if ($('input[type=checkbox]:checked').length === 6) {
                $(this).prop('checked', false);
                $(this).parents('.card').addClass('prop_false');
                $('#alert-modal').css({ display: "block" });
                $('.selectedCoins').html("");
                let selectedCoinsArr = [];
                for (let i = 0; i < $('input[type=checkbox]:checked').length; i++) {
                    let checkbox = $('input[type=checkbox]:checked')[i];
                    let parent_card = $(checkbox).parents('.card');
                    let symbol = parent_card.find('.coinSymbol').text();
                    let coin_data_div = $('<div/>').addClass('coin_data');
                    let div_container = $('<div/>').addClass('coin_container');
                    let id_coin = $(checkbox).parents('.card').attr('data-id');
                    coin_data_div.text(symbol);
                    let button = $('<button/>').text("Remove me").addClass('button_coin').attr('data-id', id_coin);
                    div_container.append(coin_data_div).append(button);
                    selectedCoinsArr.push(div_container);
                }
                for (let i = 0; i < selectedCoinsArr.length; i++) {
                    $('.selectedCoins').append(selectedCoinsArr[i]);
                }
                $('.button_coin').on('click', function () {
                    let data_id = $(this).attr('data-id');
                    let card = $('#contentDiv').find('.card' + '.' + data_id);
                    $(card).find('input[type=checkbox]').prop('checked', false);
                    $('#contentDiv').find('.card.prop_false').removeClass('prop_false').find('input[type=checkbox]').prop('checked', true);
                    $('#alert-modal').fadeOut();
                });
            } else {
                let coin = $(this).parents('.card').attr('data-id');
                let coins = sessionStorage.getItem('coins');
                if ($(this).prop('checked') === true) {
                    if (coins) {
                        coins = JSON.parse(coins)
                        coins.push(coin)
                        sessionStorage.setItem("coins", JSON.stringify(coins));
                    } else {
                        let array_coins = [];
                        array_coins.push(coin);
                        sessionStorage.setItem("coins", JSON.stringify(array_coins));
                    }
                } else {
                    if (coins) {
                        coins = JSON.parse(coins)
                        let index = coins.indexOf(coin);
                        if (index > -1) { // only splice array when item is found
                            coins.splice(index, 1); // 2nd parameter means remove one item only
                        }
                        sessionStorage.setItem("coins", JSON.stringify(coins));
                    }
                }
            }
        });
    }

    // Session storage
    function updateCoinsBySessionStorage() {
        let coins = sessionStorage.getItem('coins');
        if (coins) {
            coins = JSON.parse(coins);
            coins.forEach(coin_id => {
                $('#contentDiv').find('.card' + "." + coin_id).find('input[type=checkbox]').prop('checked', true);
            });
        }
    }

    function handleReports() {
        $("#contentDiv").html();
    }

    function handleAbout() {
        let about = "";
        about += `
        <div class="about">

        <div>
        <h3>Some words about me<h3>
        <h6>My name is Gili Pesya Zilberman <br>
        i'm 22 years old <br>
        i'm living in Ra'anana, IL <br>
        and im learning full stack development
        </h6>   
        <div>
        <img src="assets/images/pic-of-me.jpg">
        </div>
        </div>

        <div>
        <h3>Some details about the project</h3>
        <h6>This project is a website having one page that provide information and reports from the world of virtual trade. <br>
        this website is a client-side web that provide him information, About the state of currencies, prices, history, sell-buy and some more. <br>
        this project included the next subjects:
        <ul>
        <li><i class="bi bi-check-circle"></i> New HTML5 tags </li>
        <li><i class="bi bi-check-circle"></i> CSS3 media queries and advanced selectors </li>
        <li<i class="bi bi-check-circle"></i> Dynamic page layouts </li>
        <li><i class="bi bi-check-circle"></i> Bootstrap & flex </li>
        <li><i class="bi bi-check-circle"></i> Objects </li>
        <li><i class="bi bi-check-circle"></i> Callbacks, Promises, Async Await </li>
        <li><i class="bi bi-check-circle"></i> jQuery </li>
        <li><i class="bi bi-check-circle"></i> Single Page Application foundations </li>
        <li><i class="bi bi-check-circle"></i> Events </li>
        <li><i class="bi bi-check-circle"></i> Ajax (RESTful API) </li>
        <li><i class="bi bi-check-circle"></i> Documentation </li>
        <li><i class="bi bi-check-circle"></i> External API’s </li>
        <li><i class="bi bi-check-circle"></i> XAMPP Client Hosting – dropping the structure in htdocs folder </li>
        </ul>
        </h6>
        </div>
        </div>
        `;
        $("#contentDiv").html(about);
    }

    // getJson Function:
    async function getJson(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

});