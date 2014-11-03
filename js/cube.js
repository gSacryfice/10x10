//Cube class
define(['data'], function (d) {
    function Cube(o) {
        var undefined,
            cube,
            color;

        cube = this;
        this.x = o.x;
        this.y = o.y;
        this.field = o.field;
        //указатель на игру, к которой кубик привязан
        this.app = o.app;
        //понадобится дополнительно для дополнительных функций кубика
        this.extra = {};
        //направнение движения
        this.direction = (function (field) {
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
            else {
                return null;
            }
        })(this.field);

        //задаем цвет кубика
        if (o.color === undefined) {
            color = d.colors[d.f.rand(0, d.levels[d.level].colorsCount - 1)];
        }
        else {
            color = o.color;
        }
        this.color = color;

        //указатель на DOM-элемент кубика с прослушиванием событий
        this.$el = $('<div class="cube"></div>')
            .addClass(this.color + " f" + this.field)
            .hover(
            function () {
                if (cube.field === "main") {

                }
                else {
                    cube.findFirstInLine().$el.addClass("firstInHoverLine");
                }
            },
            function () {
                if (cube.field === "main") {

                }
                else {
                    cube.findFirstInLine().$el.removeClass("firstInHoverLine");
                }
            })
            .click(function () {
                if (cube.field === "main") {

                }
                else {
                    var startCube = cube.findFirstInLine();
                    cube.app.run({startCube: startCube});
                }
            });

        this.toField();
    };

    Cube.prototype.toField = function () {
        this.app.cubes._add(this);
        this.toState();
        this.app.container.append(this.$el);
    };
    Cube.prototype.findFirstInLine = function () {
        var o = {field: this.field};
        if (o.field === "top" || o.field === "bottom") {
            o.x = this.x;
            o.y = (o.field === "top") ? 9 : 0;
        }
        else {
            o.x = (o.field === "left") ? 9 : 0;
            o.y = this.y;
        }
        return this.app.cubes._get(o);
    };
    Cube.prototype.toState = function () {
        var left = this.x * d.oneWidth;
        var top = this.y * d.oneWidth;
        switch (this.field) {
            case "top":
                top -= d.oneWidth * 10;
                break;
            case "right":
                left += d.oneWidth * 10;
                break;
            case "bottom":
                top += d.oneWidth * 10;
                break;
            case "left":
                left -= d.oneWidth * 10;
                break;
        }
        this.$el.css({
            left: left,
            top: top
        });
    };
    Cube.prototype.addAnimate = function (o) {
        var action,
            delay,
            duration,
            cube;
        action = o.action;
        delay = o.delay;
        duration = o.duration;
        cube = this;
        setTimeout(function (o) {
            cube.animate(o);
        }({action: action, duration: duration}));
    };
    Cube.prototype.animate = function (o) {

        var action,
            duration,
            dur,
            cube;
        cube = this;
        action = o.action;
        duration = o.duration;
        switch (action) {
            //движение вправо со столкновением
            case "srBump":
                slideWithBump("x", "+");
                break;
            //движение вправо со столкновением
            case "sbBump":
                slideWithBump("y", "+");
                break;
            //движение вправо со столкновением
            case "slBump":
                slideWithBump("x", "-");
                break;
            //движение вправо со столкновением
            case "stBump":
                slideWithBump("y", "-");
                break;
            //движение вправо с последующим вливанием в правое поле
            case "srToSide":
                slideToSide("x", "+");
                break;
            //движение вправо с последующим вливанием в правое поле
            case "stToSide":
                slideToSide("y", "-");
                break;
            //движение вправо с последующим вливанием в правое поле
            case "slToSide":
                slideToSide("x", "-");
                break;
            //движение вправо с последующим вливанием в правое поле
            case "sbToSide":
                slideToSide("y", "+");
                break;
        }


        function bezier(duration) {
            var o = {
                1: 99,
                2: 58,
                3: 42,
                4: 34,
                5: 27,
                6: 23,
                7: 19,
                8: 15,
                9: 12,
                10: 11,
                11: 10
            }
            return o[duration];
        }

        function slideWithBump(prop, sign) {
            dur = duration - 1;
            var scale = (prop === "x") ? [0.9, 1.1] : [1.1, 0.9];
            var trans0 = {
                duration: d.animTime * dur,
                easing: 'cubic-bezier(.' + bezier(dur) + ', 0, 1, 1)'
            };
            trans0[prop] = sign + '=' + dur * d.oneWidth;
            var trans1 = {
                scale: scale,
                duration: d.animTime / 2
            };
            trans1[prop] = (sign === "+" ? "+" : "-") + "=4";
            var trans2 = {
                scale: 1,
                duration: d.animTime / 2
            }
            trans2[prop] = (sign === "+" ? "-" : "+") + "=4";
            cube.$el.transition(trans0)
                .transition(trans1)
                .transition(trans2);
        }

        function slideToSide(prop, sign) {
            dur = duration;
            var easing = 'cubic-bezier(.' + bezier(dur) + ', 0,.' + (100 - bezier(dur)) + ', 1)';
            var trans = {
                duration: d.animTime * dur,
                easing: easing
            }
            trans[prop] = sign + '=' + dur * d.oneWidth;
            cube.$el.transition(trans)
        }
    }
    return Cube;
});