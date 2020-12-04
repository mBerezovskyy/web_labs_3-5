import {
    renderItemsList,
    checkAllInputs,
    getInputs,
    clearInputs
} from "./utils.js";

import { getAllAxes, updateAxe, deleteAxe } from "./api.js";

const findButton = document.getElementById("find-button");
const clearFindButton = document.getElementById("clear-find-button");
const findInput = document.getElementById("find-input");
const sortByPriceAscButton = document.getElementById("sort-button");
const submitButton = document.getElementById("submit-button");
const hideWindowButton = document.getElementById("window_button");

let Axes = [];

let currentItemId;

const removeAxe = (element) => {
    const itemId = element.target.id.replace('delete_', "");
    deleteAxe(itemId).then(renderAxes(editAxe, removeAxe));

}

const editAxe = (element) => {
    const itemId = element.target.id.replace('edit_', "");
    currentItemId = itemId;
    document.getElementById("operations_container").style.display = 'block';

}

const renderAxes = async(editAxe, removeAxe) => {
    const allAxes = await getAllAxes();
    Axes = allAxes;
    renderItemsList(Axes, editAxe, removeAxe);
}


findButton.addEventListener("click", () => {
    const foundAxes = Axes.filter(axe => axe.brand.search(findInput.value) !== -1);

    renderItemsList(foundAxes, editAxe, removeAxe);
});

sortByPriceAscButton.addEventListener("click", () => {
    const sortedAxes = Axes.sort((axe_1, axe_2) => (axe_1.price > axe_2.price) ? 1 : -1);

    renderItemsList(sortedAxes, editAxe, removeAxe);
});

clearFindButton.addEventListener("click", () => {
    findInput.value = "";

    renderItemsList(Axes, editAxe, removeAxe);
});


submitButton.addEventListener("click", (event) => {
    event.preventDefault();

    let { brand, description, price } = getInputs();

    if (checkAllInputs()) {
        price = Number(price);

        updateAxe(currentItemId, { brand, description, price });

        document.getElementById("window_content").style.display = "block";
        document.getElementById("window_content").style.border = "none";
        document.getElementById("window_content").style.backgroundColor = "rgb(79, 174, 236);";
        document.getElementById("window_text_content").innerText = "Item was edited!";

    } else {
        document.getElementById("window_content").style.display = "block";
        document.getElementById("window_content").style.backgroundColor = "red";
        document.getElementById("window_text_content").innerText = "Input all the values to edit this item!";
    }

});

hideWindowButton.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("window_content").style.display = 'none';
    if (checkAllInputs()) {
        document.getElementById("operations_container").style.display = 'none';
        clearInputs();
        renderAxes(editAxe, removeAxe);
    }
});

renderAxes(editAxe, removeAxe);