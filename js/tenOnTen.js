define(['cube', 'cubes', 'data', 'movemap'], function (Cube, cubes, d, MoveMap) {
    var TenOnTen = function (args) {
        var undefined;
        var tenOnTen = this;

        //получаем коллекцию кубиков и устанавливаем в параметрах проложение,
        //которому эти кубики принадлежат
        this.cubes = cubes;
        this.cubes._app = this;

        //индикатор состояния приложения - разрешены какие-либо действия пользователя или нет
        this.blockApp = false;

        //уровень
        this.level = 150;
        console.log(d.f.level.colorsCount(this.level));
        console.log(d.f.level.cubesCount(this.level));

        //датчик конца хода
        this.end = null;

        //variables
        var appContainer;

        //Find App Container
        if (!args) {
            throw new Error("tenOnTen: Add tenOnTen arguments");
        }
        else if (typeof args === "string") {
            appContainer = $(args).first();
        }
        else if (typeof args === "object") {
            appContainer = $(args.appContainer).first();
        }
        else {
            throw new Error("tenOnTen: app container type error");
        }
        this.container = appContainer;


        //Initialize container function
        (function () {
            var topRightPanel = '<div class="panel topRightPanel"><div class="previousButton blocked">undo</div></div>';
            var background = '<div class="backgroungField">';
            for (var key = 0; key < d.cubesWidth * d.cubesWidth; key++) {
                background += '<div class="dCube"></div>';
            }
            background += '</div>';
            var backgroundField = $(background).css({
                height: d.oneWidth * d.cubesWidth,
                width: d.oneWidth * d.cubesWidth,
                padding: d.oneWidth * 3 + 3,
                left: d.oneWidth * -3 - 3,
                top: d.oneWidth * -3 - 3
            });
            this.container.css({
                height: d.oneWidth * d.cubesWidth,
                width: d.oneWidth * d.cubesWidth,
                margin: d.oneWidth * 3,
                position: "relative"
            }).addClass("tenOnTenContainer")
                .append(backgroundField)
                .append(topRightPanel);

            $(".tenOnTenContainer>.panel.topRightPanel>.previousButton").click(function () {
                tenOnTen.undo()
            });
        }).apply(this);


        //Initialize map function
        this.initialize = function () {
            //генерируем кубики в боковых панелях
            cubes._sideEach(function (cube, field, x, y) {
                cube = new Cube({
                    x: x,
                    y: y,
                    field: field,
                    app: tenOnTen
                });
            });

            this.generateMainCubes();
        };
        //генерируем кубики на главном поле
        this.generateMainCubes = function(){
            var firstCubesPosition = d.f.level.getPositions(this.level);
            var nullCells;
            var rand;
            for (var number = 0, len = d.f.level.cubesCount(this.level); number < len; number++) {

                var cube;

                if (firstCubesPosition[number] !== undefined) {
                    var pos = firstCubesPosition[number];
                    cube = new Cube({
                        x: pos[0],
                        y: pos[1],
                        field: 'main',
                        app: tenOnTen,
                        color: d.colors[number % d.f.level.colorsCount(this.level)],
                        disapperance: "cool"
                    });
                }
                else {
                    //создаем массив из свободных ячеек, перемешиваем его
                    if(nullCells === undefined) {
                        nullCells = [];
                        for (var x = 0; x < d.cubesWidth; x++) {
                            for (var y = 0; y < d.cubesWidth; y++) {
                                if (cubes["main"][x][y] === null) {
                                    nullCells.push({x: x, y: y});
                                }
                            }
                        }
                        d.f.shuffle(nullCells);
                    }

                    //шанс попадания кубика в крайнее поле - чем больше, тем ниже
                    var chance = 2;

                    for(var key = 0; key < chance; key++){
                        var cell = nullCells.shift();
                        if (cell.x === 0 || cell.y === 0 || cell.x === d.cubesWidth - 1 || cell.y === d.cubesWidth - 1){
                            nullCells.push(cell);
                        }
                        else{
                            break;
                        }
                    }

                    cube = new Cube({
                        x: cell.x,
                        y: cell.y,
                        field: 'main',
                        app: tenOnTen,
                        color: d.colors[number % d.f.level.colorsCount(this.level)],
                        disapperance: "cool"
                    });
                    /*var cell = nullCells.shift();
                    //если это крайний кубик, помещаем его в конец, берем следующий
                    if (cell.x === 0 || cell.y === 0 || cell.x === d.cubesWidth - 1 || cell.y === d.cubesWidth - 1){
                        nullCells.push(cell);
                        cell = nullCells.shift();
                        cube = new Cube({
                            x: cell.x,
                            y: cell.y,
                            field: 'main',
                            app: tenOnTen,
                            color: d.colors[number % d.f.level.colorsCount(this.level)],
                            disapperance: "cool"
                        });
                    }*/

                }
            }
        };
        //запускаем инициализацию приложения
        this.initialize();
        //запускаем ход, начиная движение со startCube
        this.run = function (o) {
            this.moveMap = new MoveMap();

            //создаем маску для возможности возврата хода
            this.previousStepMap = this.generateMask();

            this.moveMap.generate({
                startCube: o.startCube,
                cubes: this.cubes,
                app: tenOnTen
            });
            //пошаговый запуск анимации
            this.moveMap.animate();
            //подитоживание - внесение изменений, произошедших в абстрактном moveMap
            //в реальную коллекцию cubes
            this.cubes._mergeMoveMap(this.moveMap);

            this.checkStepEnd();

            console.log("//////////ITOG CUBES:", this.cubes);
        };
        //делаем возврат хода
        this.undo = function () {
            var previousButton = this.container.find(".panel.topRightPanel>.previousButton");
            if (previousButton.hasClass("blocked")) {
                //console.log("blocked");
            }
            else {
                //блокируем приложение до тех пор, пока не закончим анимацию
                this.blockApp = true;
                setTimeout(
                    function (app) {
                        app.blockApp = false;
                    },
                    d.animTime * 4,
                    this
                );

                previousButton.addClass("blocked");

                //массив, в котором описаны все различия между текущим и предидущим состоянием
                var changed = [];
                //пробегаем в массиве по каждому кубику предидущего массива
                for (var fieldName in this.previousStepMap) {
                    for (var x in this.previousStepMap[fieldName]) {
                        for (var y in this.previousStepMap[fieldName][x]) {
                            x = parseInt(x);
                            y = parseInt(y);
                            var pCube = this.previousStepMap[fieldName][x][y];
                            //берем соответствующее значение текущей маски для сравнения
                            var cube = this.cubes._get({field: fieldName, x: x, y: y});
                            //если предидущее - null
                            if (pCube === null) {
                                //а новое - что-то другое
                                //удаляем кубик из нового значения
                                if (cube !== null) {
                                    changed.push({
                                        field: fieldName,
                                        x: x,
                                        y: y,
                                        pCube: null,
                                        cube: cube,
                                        action: "remove"
                                    });
                                }
                            }
                            //если же раньше тут тоже был кубик
                            else {
                                //а сейчас кубика нету
                                //заполняем клетку кубиком
                                if (cube === null) {
                                    changed.push({
                                        field: fieldName,
                                        x: x,
                                        y: y,
                                        pCube: pCube,
                                        cube: null,
                                        action: "add"
                                    });
                                }
                                //если и раньше и сейчас - нужно сравнить эти значения
                                else {
                                    //пробегаемся по каждому параметру
                                    for (var prop in pCube) {
                                        //если какие-то параметры различаются,
                                        //меняем параметры кубика
                                        if (cube[prop] !== pCube[prop]) {
                                            changed.push({
                                                field: fieldName,
                                                x: x,
                                                y: y,
                                                pCube: pCube,
                                                cube: cube,
                                                action: "change"
                                            });
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                for (var key in changed) {
                    var cube = changed[key].cube;
                    switch (changed[key].action) {
                        case "add":
                            //создаем новый кубик с теми же параметрами и подменяем им предидущий
                            cube = new Cube({
                                x: changed[key].x,
                                y: changed[key].y,
                                field: changed[key].field,
                                color: changed[key].pCube.color,
                                direction: changed[key].pCube.direction,
                                app: this,
                                disapperance: "cool"
                            });
                            //console.log(cube);
                            break;
                        case "remove":
                            //удаляем нафиг кубик
                            this.cubes._set({field: changed[key].field, x: changed[key].x, y: changed[key].y}, null);
                            cube.animate({action: "remove", duration: 4, delay: 0});
                            break;
                        case "change":
                            cube.change({
                                color: changed[key].pCube.color,
                                direction: changed[key].pCube.direction
                            });
                            break;
                        default :
                            throw new Error("Неизвествое значение в changed[key].action: ", changed[key].action);
                            break;
                    }
                }

                console.log("//////////after back kubes: ", this.cubes);
            }
        };
        //генерируем маску для предидущего хода
        this.generateMask = function () {
            var cubes;
            var mask;
            var main;

            mask = {};
            cubes = this.cubes;

            for (var fieldNumber in d.fields) {
                var field = d.fields[fieldNumber];
                mask[field] = [];
                for (var x = 0; x < d.cubesWidth; x++) {
                    mask[field][x] = [];
                    for (var y = 0; y < d.cubesWidth; y++) {

                        var c = cubes._get({field: field, x: x, y: y});

                        if (c === null) {
                            mask[field][x][y] = null;
                        }
                        else {
                            mask[field][x][y] = {
                                color: c.color,
                                direction: c.direction
                            };
                        }
                    }
                }
            }

            return mask;
        };
        //проверяем в конце хода на конец уровня или конец изры
        this.checkStepEnd = function () {
            /**
             * если нет - заканчиваем ход
             * и проверяем, это просто ход или пользователь проиграл или
             * пользователь перешел на новый уровень
             * записываем в this.end:
             * null - просто ход,
             * game_over - конец игры,
             * next_level - конец уровня, переход на следующий
             */
            var cubes = this.cubes;
            var game_over = true;
            var next_level = true;

            for (var x = 0; x < d.cubesWidth; x++) {
                for (var y = 0; y < d.cubesWidth; y++) {
                    var cube = cubes["main"][x][y];

                    //если на поле еще остались кубики, уровень не завершен
                    if (cube !== null) {
                        next_level = false;
                    }

                    //если все крайние панели заполнены - конец игры,
                    //если хоть один пустой - игра продолжается
                    if (x === 0 || y === 0 || x === d.cubesWidth - 1 || y === d.cubesWidth - 1) {
                        if (cube === null) {
                            game_over = false;
                        }
                    }
                }
                if (!next_level && !game_over) {
                    break;
                }
            }

            if(next_level){
                //меняем датчик на следующий уровень
                this.end = "next_level";
            }
            else if(game_over){
                //меняем датчик на конец игры
                this.end = "game_over";
            }
            else{
                //иначе - ничего не делаем
                this.end = null;
            }
        };
        //переводим игру на следующий уровень
        this.nextLevel = function(){
            console.log("nextLevel func");
            this.level++;
            this.generateMainCubes();
        };
    };

    return TenOnTen;
});
