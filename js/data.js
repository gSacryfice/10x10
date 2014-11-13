define(function () {
    var data = {
        //ширина доски в кубиках
        cubesWidth: 10,
        //ширина одного контейнера кубика
        oneWidth: 32,
        //список полей
        fields: ["main", "top", "right", "bottom", "left"],
        //время одного шага анимации
        animTime: 45,
        //возможные цвета кубиков
        colors: ["blue", "green", "yellow", "red", "brown", "pink", "white", "purple", "lightblue", "orange"],
        //координаты кубиков для уровней с рисунками
        circles: {
            1: [[4, 3], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7]],
            2: [[3, 2], [4, 2], [5, 2], [5, 3], [5, 4], [4, 4], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6]],
            3: [[3, 3], [4, 3], [5, 3], [5, 4], [5, 5], [5, 6], [4, 5], [5, 7], [3, 5], [4, 7], [3, 7]],
            4: [[4, 2], [4, 3], [4, 4], [5, 4], [6, 4], [6, 3], [6, 5], [6, 2], [6, 6]],
            5: [[6, 3], [5, 3], [4, 3], [4, 4], [4, 5], [5, 5], [6, 5], [6, 6], [6, 7], [5, 7], [4, 7]],
            6: [[3, 2], [3, 3], [4, 2], [3, 4], [5, 2], [4, 4], [3, 5], [5, 4], [3, 6], [5, 5], [4, 6], [5, 6]],
            7: [[3, 3], [4, 3], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8]],
            8: [[4, 2], [5, 2], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [5, 6], [4, 6], [4, 5], [4, 4], [4, 3], [5, 4]],
            9: [[3, 2], [4, 2], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [4, 6], [3, 6], [3, 3], [3, 4], [4, 4]],
            10: [[2, 3], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [6, 7], [7, 7], [7, 6], [7, 5], [7, 4], [7, 3], [6, 3]],
            100: [[0, 3], [1, 3], [1, 4], [1, 5], [1, 6], [3, 3], [3, 4], [3, 5], [3, 6], [4, 6], [5, 6], [5, 5], [5, 4], [5, 3], [4, 3], [7, 3], [7, 4], [7, 5], [7, 6], [8, 6], [9, 6], [9, 5], [9, 4], [9, 3], [8, 3]]
        },
        f: {
            //распределение по уровням
            level: {
                colorsCount: function (level) {
                    return 5;
                },
                cubesCount: function (level) {
                    if ((level > 0 && level < 11) || level === 100) {
                        var cubesCount = {
                            1: 6,
                            2: 11,
                            3: 11,
                            4: 9,
                            5: 11,
                            6: 12,
                            7: 7,
                            8: 13,
                            9: 12,
                            10: 18,
                            100: 25
                        };
                        return cubesCount[level];
                    }
                    else {
                        throw new Error("Неправильный уровень: ", level);
                    }
                },
                getPositions: function (level) {
                    if ((level > 0 && level < 11) || level === 100) {
                        return data.circles[level];
                    }
                    else {
                        throw new Error("Неправильный уровень: ", level);
                    }
                }
            },

            rand: function rand(min, max) {
                return min + ((max - min + 1) * Math.random() ^ 0);
            },
            reverseField: function (field) {
                if (field === "top") {
                    return "bottom";
                }
                else if (field === "bottom") {
                    return "top";
                }
                else if (field === "left") {
                    return "right";
                }
                else if (field === "right") {
                    return "left";
                }
            }
        }
    };

    return data;
})
;