// ==UserScript==
// @name         binance-force-trade
// @namespace    http://ntsd.dev
// @version      0.1
// @description  Auto change price and abount to market price for limit position
// @author       ntsd
// @match        https://www.binance.com/en/trade/*?layout=pro
// @icon         https://www.google.com/s2/favicons?domain=binance.com
// @grant        none
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function percentage(percent, total) {
    return (percent / 100) * total
}

(function () {
    'use strict';

    // wait content loaded
    sleep(10000).then(() => {
        const bitOrders = document.getElementsByClassName("orderbook-bid")[0];
        const askOrders = document.getElementsByClassName("orderbook-ask")[0];
        let buyPrice;
        let buyAmount;
        let buyAmountStepPrecision;
        let sellPrice;
        let sellAmount;
        let sellAmountStepPrecision;

        let checkboxContainerB = document.createElement("div");
        let checkboxB = document.createElement("input");
        checkboxB.setAttribute("id", "auto-price-checkbox");
        checkboxB.setAttribute("type", "checkbox");
        checkboxB.setAttribute("value", true);
        checkboxB.setAttribute("name", "Auto Price");
        checkboxB.setAttribute('style', 'display: inline;')
        checkboxContainerB.appendChild(checkboxB);
        let textB = document.createElement("div");
        textB.innerHTML = "Auto Bid Price";
        textB.setAttribute('style', 'display: inline;')
        checkboxContainerB.appendChild(textB);
        document.getElementsByName("orderform")[0].appendChild(checkboxContainerB);

        let checkboxContainerA = document.createElement("div");
        let checkboxA = document.createElement("input");
        checkboxA.setAttribute("id", "auto-price-checkbox");
        checkboxA.setAttribute("type", "checkbox");
        checkboxA.setAttribute("value", true);
        checkboxA.setAttribute("name", "Auto Price");
        checkboxA.setAttribute('style', 'display: inline;')
        checkboxContainerA.appendChild(checkboxA);
        let textA = document.createElement("div");
        textA.innerHTML = "Auto Ask Price";
        textA.setAttribute('style', 'display: inline;')
        checkboxContainerA.appendChild(textA);
        document.getElementsByName("orderform")[0].appendChild(checkboxContainerA);

        var bitOrdersObserver = new MutationObserver(function (mutationsList) {
            if (checkboxB.checked) {
                const bitBestOrder = bitOrders.getElementsByClassName("row-content")[0];
                const bitBestOrderPrice = bitBestOrder.children[0].innerHTML;
                if (!buyPrice) {
                    buyPrice = document.getElementById("FormRow-BUY-price");
                    buyAmount = document.getElementById("FormRow-BUY-quantity");
                    buyAmountStepPrecision = buyAmount.getAttribute('step').split('1')[0].replace('.', '').length
                }
                buyPrice.value = bitBestOrderPrice;
                console.log('bit order ', bitBestOrderPrice);


                const buyPercent = parseFloat(document.getElementsByClassName("bn-slider-radio-tooltip")[0].innerHTML.trimEnd("%"));
                const buyAval = parseFloat(document.getElementsByClassName("proInnerForm")[0].children[1].children[0].lastChild.children[0].innerHTML.split());
                buyAmount.value = percentage(buyPercent, buyAval / parseFloat(bitBestOrderPrice)).toFixed(buyAmountStepPrecision);
                console.log('buyPercent', buyPercent);
                console.log('buyAval', buyAval);
                console.log('buyAmount', buyAmount.value);
                console.log('buyAmountStepPrecision', buyAmountStepPrecision)
            }
        });
        bitOrdersObserver.observe(bitOrders, { attributes: true, childList: true, subtree: true });

        var askOrdersObserver = new MutationObserver(function (mutationsList) {
            if (checkboxA.checked) {
                const rows = askOrders.getElementsByClassName("row-content");
                const askBestOrder = rows[rows.length - 1];
                const askBestOrderPrice = askBestOrder.children[0].innerHTML;
                if (!sellPrice) {
                    sellPrice = document.getElementById("FormRow-SELL-price");
                    sellAmount = document.getElementById("FormRow-SELL-quantity");
                    sellAmountStepPrecision = sellAmount.getAttribute('step').split('1')[0].replace('.', '').length
                }
                sellPrice.value = askBestOrderPrice;
                console.log('ask order ', askBestOrderPrice);


                const sellPercent = parseFloat(document.getElementsByClassName("bn-slider-radio-tooltip")[1].innerHTML.trimEnd("%"));
                const sellAval = parseFloat(document.getElementsByClassName("proInnerForm")[1].children[1].children[0].lastChild.children[0].innerHTML.split());
                sellAmount.value = percentage(sellPercent, sellAval).toFixed(sellAmountStepPrecision);
                console.log('sellPercent', sellPercent);
                console.log('sellAval', sellAval);
                console.log('sellAmount', sellAmount.value);
                console.log('sellAmountStepPrecision', sellAmountStepPrecision)
            }
        });
        askOrdersObserver.observe(askOrders, { attributes: true, childList: true, subtree: true });
    });
})();
