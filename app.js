// ==UserScript==
// @name         binance-auto-limit-price
// @namespace    https://ntsd.dev
// @version      0.1
// @description  A Binance extension to auto change limit price to the best ask/bid orders.
// @author       Jirawat Boonkumnerd (@ntsd)
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

    // wait content loaded delay 10 sec
    sleep(10000).then(() => {
        const bitOrders = document.getElementsByClassName("orderbook-bid")[0];
        const askOrders = document.getElementsByClassName("orderbook-ask")[0];
        let buyPrice;
        let buyPriceStep;
        let buyPriceStepPrecision;
        let buyAmount;
        let buyAmountStepPrecision;
        let sellPrice;
        let sellPriceStep;
        let sellPriceStepPrecision;

        // Add UI
        const orderForm = document.getElementsByName("orderform")[0];

        let checkboxContainerB = document.createElement("div");
        let checkboxB = document.createElement("input");
        checkboxB.setAttribute("id", "auto-price-checkbox");
        checkboxB.setAttribute("type", "checkbox");
        checkboxB.setAttribute("value", true);
        checkboxB.setAttribute("name", "Auto Price");
        checkboxB.setAttribute('style', 'display: inline;')
        checkboxContainerB.appendChild(checkboxB);
        let textB = document.createElement("div");
        textB.innerHTML = "Auto Buy Price";
        textB.setAttribute('style', 'display: inline;')
        checkboxContainerB.appendChild(textB);
        orderForm.appendChild(checkboxContainerB);

        let checkboxContainerA = document.createElement("div");
        let checkboxA = document.createElement("input");
        checkboxA.setAttribute("id", "auto-price-checkbox");
        checkboxA.setAttribute("type", "checkbox");
        checkboxA.setAttribute("value", true);
        checkboxA.setAttribute("name", "Auto Price");
        checkboxA.setAttribute('style', 'display: inline;')
        checkboxContainerA.appendChild(checkboxA);
        let textA = document.createElement("div");
        textA.innerHTML = "Auto Sell Price";
        textA.setAttribute('style', 'display: inline;')
        checkboxContainerA.appendChild(textA);
        orderForm.appendChild(checkboxContainerA);

        let checkboxContainerS = document.createElement("div");
        let checkboxS = document.createElement("input");
        checkboxS.setAttribute("id", "auto-price-checkbox");
        checkboxS.setAttribute("type", "checkbox");
        checkboxS.setAttribute("value", true);
        checkboxS.setAttribute("name", "Auto Price");
        checkboxS.setAttribute('style', 'display: inline;')
        checkboxContainerS.appendChild(checkboxS);
        let textS = document.createElement("div");
        textS.innerHTML = "Increment/Decrement 1 step";
        textS.setAttribute('style', 'display: inline;')
        checkboxContainerS.appendChild(textS);
        orderForm.appendChild(checkboxContainerS);
        // End UI

        const buyCallback = function (mutationsList) {
            if (!checkboxB.checked) return
            const bitBestOrder = bitOrders.getElementsByClassName("row-content")[0];
            const bitBestOrderPrice = parseFloat(bitBestOrder.children[0].innerHTML);
            if (!buyPrice) {
                buyPrice = document.getElementById("FormRow-BUY-price");
                buyPriceStep = parseFloat(buyPrice.getAttribute('step'));
                buyPriceStepPrecision = buyPrice.getAttribute('step').split('1')[0].replace('.', '').length
                buyAmount = document.getElementById("FormRow-BUY-quantity");
                buyAmountStepPrecision = buyAmount.getAttribute('step').split('1')[0].replace('.', '').length
            }
            let buyOrderPrice = bitBestOrderPrice;
            if (checkboxS.checked) {
                buyOrderPrice += buyPriceStep;
            }
            buyPrice.value = buyOrderPrice.toFixed(buyPriceStepPrecision);
            console.log('buy price', buyPrice.value);

            const buyPercent = parseFloat(document.getElementsByClassName("bn-slider-radio-tooltip")[0].innerHTML.trimEnd("%"));
            const buyAvailable = parseFloat(document.getElementsByClassName("proInnerForm")[0].children[1].children[0].lastChild.children[0].innerHTML.split());
            buyAmount.value = percentage(buyPercent, buyAvailable / buyOrderPrice).toFixed(buyAmountStepPrecision);
            console.log('buy available', buyAvailable);
            console.log('buy percent', buyPercent);
            console.log('buy amount', buyAmount.value);
        }

        var bitOrdersObserver = new MutationObserver(buyCallback);
        bitOrdersObserver.observe(bitOrders, { attributes: true, childList: true, subtree: true });

        const sellCallback = function (mutationsList) {
            if (!checkboxA.checked) return
            const rows = askOrders.getElementsByClassName("row-content");
            const askBestOrder = rows[rows.length - 1];
            const askBestOrderPrice = parseFloat(askBestOrder.children[0].innerHTML);
            if (!sellPrice) {
                sellPrice = document.getElementById("FormRow-SELL-price");
                sellPriceStep = parseFloat(sellPrice.getAttribute('step'));
                sellPriceStepPrecision = sellPrice.getAttribute('step').split('1')[0].replace('.', '').length
            }
            let sellOrderPrice = askBestOrderPrice;
            if (checkboxS.checked) {
                sellOrderPrice -= sellPriceStep;
            }
            sellPrice.value = sellOrderPrice.toFixed(sellPriceStepPrecision);
            console.log('sell price', sellPrice.value);
        }

        var askOrdersObserver = new MutationObserver(sellCallback);
        askOrdersObserver.observe(askOrders, { attributes: true, childList: true, subtree: true });
    });
})();
