window.onload = function () {
    card = {};
    goods = {};
        /* GETTING DATA FROM STORAGE*/
    function loadCardFromStorage() {
        if (sessionStorage.getItem('card') != undefined) {
            card = JSON.parse(sessionStorage.getItem('card'));
        }
    }
    loadCardFromStorage();
    /* END */

    selectedGoodsID = '';
    let getJSON = function (url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            let status = xhr.status;
            if (status == 200) {
                callback(null, xhr.response)
            }
            else {
                callback(status, xhr.response);
            }
        };
        xhr.send();
    }

    getJSON('https://spreadsheets.google.com/feeds/list/1bLe6_mQakrnM6NCYyQr8llzPNo8C0jDOFXeluF7nx3E/od6/public/values?alt=json', function (err, data) {
        if (err != null) {
            console.log('Error:');
        }
        else {
            data = data['feed']['entry'];
            goods = data;
            if (document.getElementById('goods')) {
                document.getElementById('goods').innerHTML += ShowGoods(data);
                renderBasket();
            }
            else if (document.getElementById('goods-content')) {
                document.getElementById('goods-content').innerHTML = ShowOneItem(data);
                renderBasket();
            }
            else if (document.getElementById('basketContent')) {
                document.getElementById('basketContent').innerHTML = showBasketContent(data);
                document.getElementById('basketData').innerHTML = `<textarea value="" name="comment">${insertData()}</textarea>`;
                renderBasket();
            }
        }
    });
}

/* INSERT DATA INTO HIDDEN INPUT*/
function insertData() {
    var out = "";
    for (var item in card) {
        out += `${goods[item]['gsx$name']['$t']} : ${card[item]} шт    `;
    }
    return out;
}
/* END */


/*  */

document.onclick = function (e) {
    selectedGoodsID = e.target.attributes.data.nodeValue;
    if (e.target.attributes.name.nodeValue == "add_to_card") {
        addToBasket(selectedGoodsID);
    }
    else if (e.target.attributes.name.nodeValue == "block") {
        ShowOneItem(goods);
    }
    else if (e.target.attributes.name.nodeValue == "card_add") {
        addToBasket(selectedGoodsID);
        document.getElementById(`count-${goods[selectedGoodsID]['gsx$id']['$t']}`).innerHTML = card[selectedGoodsID];
        document.getElementById(`item-cost-${goods[selectedGoodsID]['gsx$id']['$t']}`).innerHTML = goods[selectedGoodsID]['gsx$cost']['$t'] * card[selectedGoodsID] + "грн";
    }
    else if (e.target.attributes.name.nodeValue == "card_delete") {
        delete card[selectedGoodsID];
        sessionStorage.setItem("card", JSON.stringify(card));
        renderBasket();
        showTotals();
        document.getElementById(`del-${goods[selectedGoodsID]['gsx$id']['$t']}`).innerHTML = "";
    }
    else if (e.target.attributes.name.nodeValue == "card_delete_one") {
        removeFromBasket(selectedGoodsID);
        renderBasket();
        document.getElementById(`count-${goods[selectedGoodsID]['gsx$id']['$t']}`).innerHTML = card[selectedGoodsID];
        document.getElementById(`item-cost-${goods[selectedGoodsID]['gsx$id']['$t']}`).innerHTML = goods[selectedGoodsID]['gsx$cost']['$t'] * card[selectedGoodsID] + "грн";
    }
    else if (e.target.attributes.name.nodeValue == "removeOne") {
        delete card[selectedGoodsID];
        sessionStorage.setItem("card", JSON.stringify(card));
        renderBasket();
        if (document.getElementById('basketContent')) {
            document.getElementById('basketContent').innerHTML = showBasketContent(goods);
        }
        document.getElementById("mainPrice").textContent = "0 грн";
        showTotals();
    }
    else if (e.target.attributes.name.nodeValue == "remove_basket") {
        sessionStorage.clear();
    card = {};
    document.getElementById("mainPrice").textContent = "0 грн";
    renderBasket();
    document.getElementById('basketContent').innerHTML = showBasketContent(goods);
    }
}

/* REMOVE ALL ITEMS WITH MINI-BASKET */


/* END */


/* CHANGE THE STORAGE DATA CSS */
function removeFromBasket(elem) {
    if (card[elem] != 1) {
        card[elem]--;
    }
    else {
        document.getElementById(`del-${goods[selectedGoodsID]['gsx$id']['$t']}`).innerHTML = "";
        delete card[selectedGoodsID];
        sessionStorage.setItem("card", JSON.stringify(card));
        renderBasket();

    }
    sessionStorage.setItem("card", JSON.stringify(card));
    renderBasket();
}

function addToBasket(elem) {
    if (card[elem] !== undefined) {
        card[elem]++;
    }
    else {
        card[elem] = 1;
    }
    sessionStorage.setItem("card", JSON.stringify(card));
    renderBasket();
}
/* END*/


/* ADDING CONTENT INTO BASKET PAGE */
function showBasketContent(goods) {
    var out = ``;
    if (card != undefined) {
        for (var item in card) {
            out += `<div class="basket-view-container" id ="del-${goods[item]['gsx$id']['$t']}">
            <div class="basket-view">
                <div class="item-photo">
                    <img src="${goods[item]['gsx$image']['$t']}" alt="${goods[item]['gsx$name']['$t']}"></div>
                    <div class="card-product-info">
                        <div>${goods[item]['gsx$name']['$t']}</div>
                        <div>${goods[item]['gsx$article']['$t']}</div>
                    </div>
                    <div class="card-product-count">
                        <button name='card_add' data="${goods[item]['gsx$id']['$t']}" >+</button>
                        <div id="count-${goods[item]['gsx$id']['$t']}">${card[item]}</div>
                        <button name='card_delete_one' data="${goods[item]['gsx$id']['$t']}" id="add">-</button>
                    </div>
                    <div id = "item-cost-${goods[item]['gsx$id']['$t']}" class="item-cost">${goods[item]['gsx$cost']['$t'] * card[item]} грн</div>
                    <div class="delete-item">
                        <button>
                            <img src="../public/img/delete.png" alt="" name='card_delete' data="${goods[item]['gsx$id']['$t']}"></div>
                        </button>
                    </div>
                
               </div>`;
        }
        return out;
    }
    else {
        return "";
    }
}
/*END*/


/* MINI BASKET CSS */
function renderBasket() {
    var content = document.querySelector('.commodity');
    var contentprice = document.getElementById('mainPrice');
    content.innerHTML = "";
    for (var item in card) {
        var out = ``;
        out += `<div class="commodity__contents">
                            <img class="image_content" src="${goods[item]['gsx$image']['$t']}" alt="${goods[item]['gsx$name']['$t']}">
                                <div class="information__about__commodity">
                                    <a href="" class="link__on__commodity" title="Посилання на товар">${goods[item]['gsx$name']['$t']}</a>
                                    <div class="cost">
                                        <div class="price">${goods[item]['gsx$cost']['$t']} грн</div>
                                        <div class="number">${card[item]} шт.</div>
                                        <div class="full__price">${goods[item]['gsx$cost']['$t'] * card[item]} <span>грн</span></div></div></div>
                                        <img class="remove" name = 'removeOne' data="${goods[item]['gsx$id']['$t']}" src="/public/img/delete.png">
                                        </div>`;
        content.innerHTML += out;
        showTotals();
    }
}

function showTotals() {
    var items = document.querySelectorAll(".full__price");
    const total = [];

    items.forEach(function (price) {
        total.push(parseFloat(price.textContent));
    });
    const totalMoney = total.reduce(function (total, item) {
        total += item;
        return total;
    }, 0)
    const finalMoney = totalMoney + ' грн';

    document.getElementById("mainPrice").textContent = finalMoney;
}
/* END */



function ShowGoods(data) {
    var out = '';
    for (var key in data) {
        out += `<div>
        <a href = /goods?id=${data[key]['gsx$id']['$t']}> 
         <div class="card  self-item text-center border-1" style="width: 18rem; cursor:pointer;">
         <img data="${data[key]['gsx$id']['$t']}" name="block" class="card-img-top" src="${data[key]['gsx$image']['$t']}" alt="${data[key]['gsx$name']['$t']}">
         <div class="card-body ">
         <h5  class="card-title">${data[key]['gsx$name']['$t']}</h5>
         <p class="card-text ">${data[key]['gsx$cost']['$t']} грн</p>
         <p class="card-text">${data[key]['gsx$description']['$t']}</p>
         </div>
         </a>
         <button type="button" class="btn btn-outline-info" data="${data[key]['gsx$id']['$t']}" name="add_to_card">Купити</button>
         </div>
         </div>`;
    }
    return out;
}
var idElement = [];
var urlParams = new URLSearchParams(window.location.search);



// Take ID FROM URL
function ShowOneItem(data) {
    const test = data.find((item) => {
        return item.gsx$id.$t === urlParams.get('id');
    });
    // PUSH ID TO THE ARR
    function takenId() {
        for (var key in data) {
            idElement.push(data[key].gsx$id.$t);
        }
    }

    takenId()

    // RANDOMIZE THE ARR
    var unicIdArr = getUnicIdArr(idElement, 4);

    function getUnicIdArr(arr, unicArrlength) {
        var unicIdArr = [];
        do {
            var randomId = getRandomInt(Math.max(...arr)) + '';
            if (!unicIdArr.includes(randomId) && arr.includes(randomId)) {
                unicIdArr.push(randomId);
            };
        } while (unicIdArr.length < unicArrlength);

        return unicIdArr

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }
    }

    var out = '';

    out += `<div class="goods__flex">
                                <div class="goods__photos">
                                    <div class="mySlides" style="display: block;">
                                        <img src="${test.gsx$mainimage.$t}" style="width:100%">
                </div>
                                        <div class="mySlides">
                                            <img src="${test.gsx$imageone.$t}" style="width:100%">
                 </div>

                                            <div class="mySlides">
                                                <img src="${test.gsx$imagetwo.$t}" style="width:100%">
                </div>

                                                <div class="mySlides">
                                                    <img src="${test.gsx$imagethree.$t}" style="width:100%">
                </div>

                                                    <div class="caption-container">
                                                        <p id="caption">${test.gsx$name.$t}</p>
                                                    </div>

                                                    <div class="row">
                                                        <div class="column">
                                                            <img class="demo cursor" src="${test.gsx$mainimage.$t}" style="width:100%" onclick="currentSlide(1)" alt="${test.gsx$name.$t}">
                    </div>
                                                            <div class="column">
                                                                <img class="demo cursor" src="${test.gsx$imageone.$t}" style="width:100%" onclick="currentSlide(2)" alt="${test.gsx$name.$t}">
                    </div>
                                                                <div class="column">
                                                                    <img class="demo cursor" src="${test.gsx$imagetwo.$t}" style="width:100%" onclick="currentSlide(3)" alt="${test.gsx$name.$t}">
                    </div>
                                                                    <div class="column">
                                                                        <img class="demo cursor" src="${test.gsx$imagethree.$t}" style="width:100%" onclick="currentSlide(4)" alt="${test.gsx$name.$t}">
                    </div>
                </div>
            </div>
            <div class="goods__wrap">
                <div class="goods__name">${test.gsx$name.$t}</div>
                <div class="goods__price">${test.gsx$cost.$t} грн.</div>
                <div class="goods__title">
                    <h3>${test.gsx$extradescription.$t}</h3>
                </div>
                <div class="goods__buttons">
                    <a href="#"><button class="first__btn" data="${test['gsx$id']['$t']}" name="add_to_card">Добавити до корзини</button></a>
                    <a href="/basket"><button class="second__btn" data="${test['gsx$id']['$t']}" name="add_to_card">Купити в один клік</button></a>
                </div>
                <div class="goods__links">
                    <a href="#" class="first__link" data-toggle="modal" data-target="#staticBackdrop">Доставка і оплата</a>
                    <!-- Modal -->

                    <div class="modal fade" id="staticBackdrop" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="#staticBackdrop"
                                                                            aria-hidden="true">
                                                                            <div class="modal-dialog" role="document">
                                                                                <div class="modal-content">
                                                                                    <div class="modal-header">
                                                                                        <h5 class="modal-title" id="exampleModalLabel">Доставка і оплата</h5>
                                                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                                                            <span aria-hidden="true">&times;</span>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div class="modal-body">
                                                                                        <h3>Доставка:</h3>
                                                                                        <ul>
                                                                                            <li>Нова пошта (до відділення/до дверей)</li>
                                                                                            <li>Самовивіз / Особиста зустріч</li>
                                                                                            <li>Укрпошта</li>
                                                                                        </ul>
                                                                                        <h3>Способи оплати:</h3>
                                                                                        <ul>
                                                                                            <li>Готівковий</li>
                                                                                            <li>Банківський переказ</li>
                                                                                            <li>При доставці товару</li>
                                                                                            <li>Visa/Mastercard</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                    <div class="modal-footer">
                                                                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <!-- Modal -->
                    <div class="modal fade bd-example-modal-lg" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog modal-lg modal-dialog-scrollable" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title text-center" id="exampleModalScrollableTitle">Наявність в магазині</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6415.976575214061!2d24.73455391851315!3d48.938428683966094!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4730c1cd378e3003%3A0xb3c03e72e9de9027!2z0IbQs9GA0LDRiNC60Lgg0KDQsNC00L7RgdGC0LjQvdC60Lg!5e0!3m2!1suk!2sua!4v1580894698653!5m2!1suk!2sua" width="750" height="500" frameborder="0" style="border:0;" allowfullscreen=""></iframe>      </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрити</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div class="goods__recomended">
                <div class="goods__recomended-title">
                    <h3>Вам також сподобається</h3>
                </div>
                <div class="goods__recomended-items">
                    <a href = /goods?id=${data[unicIdArr[0]]['gsx$id']['$t']}>
                        <div class="goods__recomended-item border-bottom border-secondary">
                            <div class="goods__recomended-item__image">
                                <img src="${data[unicIdArr[0]].gsx$mainimage.$t}" alt="">
                            </div>
                            <div class="goods__recomended-item-name">
                            ${data[unicIdArr[0]].gsx$name.$t}
                            </div>
                            <div class="goods__recomended-item-price">
                            ${data[unicIdArr[0]].gsx$cost.$t} грн.
                            </div>
                        </div>
                    </a>
                    <a href = /goods?id=${data[unicIdArr[1]]['gsx$id']['$t']}>
                        <div class="goods__recomended-item border-bottom border-secondary">
                            <div class="goods__recomended-item__image">
                                <img src="${data[unicIdArr[1]].gsx$mainimage.$t}" alt="">
                            </div>
                            <div class="goods__recomended-item-name">
                            ${data[unicIdArr[1]].gsx$name.$t}
                            </div>
                            <div class="goods__recomended-item-price">
                            ${data[unicIdArr[1]].gsx$cost.$t} грн.

                            </div>
                                                                        </div>
                    </a>
                    <a href = /goods?id=${data[unicIdArr[2]]['gsx$id']['$t']}>
                        <div class="goods__recomended-item border-bottom border-secondary">
                            <div class="goods__recomended-item__image">
                                <img src="${data[unicIdArr[2]].gsx$mainimage.$t}" alt="">
                            </div>
                            <div class="goods__recomended-item-name">
                            ${data[unicIdArr[2]].gsx$name.$t}
                            </div>
                            <div class="goods__recomended-item-price">
                            ${data[unicIdArr[2]].gsx$cost.$t} грн.
                            </div>
                        </div>
                    </a>
                    <a href = /goods?id=${data[unicIdArr[3]]['gsx$id']['$t']}>
                        <div class="goods__recomended-item border-bottom border-secondary">
                            <div class="goods__recomended-item__image">
                                <img src="${data[unicIdArr[3]].gsx$mainimage.$t}" alt="">
                            </div>
                            <div class="goods__recomended-item-name">
                            ${data[unicIdArr[3]].gsx$name.$t}
                            </div>
                            <div class="goods__recomended-item-price">
                            ${data[unicIdArr[3]].gsx$cost.$t} грн.

                            </div>
                                                                        </div>
                    </a>
                                                                </div>
                                                            </div>`

    return out;
}



/* HEADER FIXED FUNCTION  */

$(document).ready(function () {
    const $window = $(window);
    console.log(window.location.pathname);
    $(window).scroll(function () {
        if ($(window).scrollTop() >= 0.9*$window.height()) {
            $('#hidden-header').css({
                'border-bottom': '2px solid white', 'background-color': '#fff',
                'box-shadow': '0 0 10px rgba(0,0,0,0.5)'
            });
        } else {
            $('#hidden-header').css({ border: 'none', 'background-color': 'transparent', 'box-shadow': 'none' });
        }
    });
});
/* END */


/* Sliden on goods page */

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    captionText.innerHTML = dots[slideIndex - 1].alt;
};
/* END */


/* SENDING DATA FOR NODEJS */
$(function () {
    $("#main-form").submit(function (event) {
        event.preventDefault();
        $.post("/basket", $(this).serialize()).done(function(data) {
            if(data){
                $('#boxUserFirstInfo').arcticmodal({
                    closeOnOverlayClick: false,
                    closeOnEsc: true
                }); 
          }
              else {$('#boxUserFirstInfoFalse').arcticmodal({
                closeOnOverlayClick: false,
                closeOnEsc: true
            }); }
            });
            
    })
})
/* END */
