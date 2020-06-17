//Budget Controller:
var budgetController = (function () {
    function Expense(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    function Income(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var allExpenses = [];
    var allincomes = [];

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItem[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItem: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //Create new ID:
            if (data.allItem[type].length > 0) {
                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;

            } else {
                ID = 0;
            }
            //Create new Item:
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push on data structure:
            data.allItem[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id){
            var ids,  index;
            ids = data.allItem[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if( index !== -1 ){
                data.allItem[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            //calculate total income and expenses:
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate the budget:
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the percentage of income that we spent:
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },

        testing: function () {
            console.log(data);
        }
    };

})();

//UI Controller:
var UIController = (function () {
    var DOMstring = {
        inputType: '.add__type',
        inputDes: '.add__description',
        inputvalue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        titleMonth: 'budget__title--month'
    };
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value,
                description: document.querySelector(DOMstring.inputDes).value,
                value: parseFloat(document.querySelector(DOMstring.inputvalue).value),
            };

        },

        addListItem: function (obj, type) {
            //Create HTML string:
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstring.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else if (type === 'exp') {
                element = DOMstring.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__percentage">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div></div></div>';
            }

            //insert data to HTML string:
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert HTML to DOM:
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstring.inputDes + ', ' + DOMstring.inputvalue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            let currentDate = new Date();
            document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstring.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstring.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMstring.percentageLabel).textContent = '---';
            }
        },

        getDOMstrings: function () {
            return DOMstring;
        }
    }
})();

//App Controller:
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.wich === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };
    var updateBudget = function () {
        //1. Calculate the budget:
        budgetCtrl.calculateBudget();
        //2. Return the Budget:
        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI:
        UICtrl.displayBudget(budget);
    };

    var updatePercenages = function () {
      // 1. calculate percentage:

      // 2. read percentage from the budget controller:

      // 3. update UI:

    };

    var ctrlAddItem = function () {
        var input, newItem;
        // 1.Get the input data:
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller:
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Add the item to the UI:
            UICtrl.addListItem(newItem, input.type);
            //4. Clear the Fields:
            UICtrl.clearFields();
            //5. Calculate and update Budget:
            updateBudget();
            //6. Calculate and update Percentage:
            updatePercenages();
        }
    };

    var ctrlDeleteItem = function (event) {
        var itemId, splitId, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split('-');
            type = splitId[0];
            ID = parseInt( splitId[1]);

            //1. delete the item in data structure:
            budgetCtrl.deleteItem(type, ID);
            //2. delete the item in UI:
            UICtrl.deleteListItem(itemId);
            //3. update and show new budget:
            updateBudget();
            //4. Calculate and update Percentage:
            updatePercenages();



        }
    };

    return {
        init: function () {
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();