class Cow {
    constructor(texture=-2) {
        this.type = 'cow';
        this.texture = texture;
        
    }

    render() {
        // cow colors
        let brown = [.44,.15,.01,1]
        let dBrown = [brown[0]*.9, brown[1]*.9, brown[2]*.9, 1];
        let hBrown = [brown[0]*.4, brown[1]*.4, brown[2]*.4, 1];

        // body
        var bodyM = new Matrix4();
        bodyM.translate(-.3, g_bodyY-.009, 0);
        bodyM.rotate(g_bodyAngle, 1, 0, 0);
        bodyM.translate(0, -.3, -.5)
        var bodyPosM = new Matrix4(bodyM);  // save body pos
        bodyM.translate(0, .2, .5)
        bodyM.scale(0.6, 0.6, 1.1);
        bodyM.translate(0,-.3, -.5)
        var body = new Cube(bodyM, dBrown, this.texture);
        body.render();

        // front left leg
        var leftArmM = new Matrix4(bodyPosM);
        leftArmM.translate(.3,0,0)
        leftArmM.translate(0.07, .3, 0.25);
        leftArmM.rotate(g_frontLegAngle, 1, 0, 0);
        leftArmM.translate(0, -.5, -.125);
        var leftArmPos = new Matrix4(leftArmM);
        leftArmM.scale(0.15, 0.25, 0.15);
        var leftArm = new Cube(leftArmM, brown, this.texture);
        leftArm.render();

        leftArmM = leftArmPos;
        leftArmM.translate(.01, -.1, .01);
        leftArmM.scale(.13, .15, .13);
        leftArmM.translate(0, 1, .5)
        leftArmM.rotate(g_frontKneeAngle, 1, 0, 0);
        leftArmM.translate(0, -1, -.5)
        var leftArm = new Cube(leftArmM, brown, this.texture);
        leftArm.render();

        leftArmM.scale(.9, .9, .8);
        leftArmM.translate(.1, -.3, .1);
        leftArmM.translate(0, .5, .5);
        leftArmM.rotate(g_frontHoofAngle, 1, 0, 0);
        leftArmM.translate(0, -.5, -.5);
        var hoof = new Cube(leftArmM, hBrown);
        hoof.render();

        // front right leg
        var rightArmM = new Matrix4(bodyPosM);
        rightArmM.translate(0.07, .3, 0.25);
        rightArmM.rotate(g_frontLegAngle, 1, 0, 0);
        rightArmM.translate(0.00, -.5, -.125);
        var rightArmPos = new Matrix4(rightArmM);
        rightArmM.scale(0.15, 0.25, 0.15);
        var rightArm = new Cube(rightArmM, brown, this.texture);
        rightArm.render();

        rightArmM = rightArmPos;
        rightArmM.translate(.01, -.1, .01);
        rightArmM.scale(.13, .15, .13);
        rightArmM.translate(0, 1, .5)
        rightArmM.rotate(g_frontKneeAngle, 1, 0, 0);
        rightArmM.translate(0, -1, -.5)
        rightArm = new Cube(rightArmM, brown, this.texture);
        rightArm.render();

        rightArmM.scale(.9, .9, .8);
        rightArmM.translate(.1, -.3, .1);
        rightArmM.translate(0, .5, .5);
        rightArmM.rotate(g_frontHoofAngle, 1, 0, 0);
        rightArmM.translate(0, -.5, -.5);
        hoof = new Cube(rightArmM, hBrown);
        hoof.render();

        // back right leg
        var rightLegM = new Matrix4(bodyPosM);
        rightLegM.translate(0, 0, .65)
        rightLegM.translate(0.07, .3, 0.25);
        rightLegM.rotate(g_backLegAngle, 1, 0, 0);
        rightLegM.translate(0.00, -.5, -.125);
        var rightLegPos = new Matrix4(rightLegM);
        rightLegM.scale(0.15, 0.25, 0.15);
        var rightLeg = new Cube(rightLegM, brown, this.texture);
        rightLeg.render();

        rightLegM = rightLegPos;
        rightLegM.translate(.01, -.1, .01);
        rightLegM.scale(.13, .15, .13);
        rightLegM.translate(0, 1, .5)
        rightLegM.rotate(g_backKneeAngle, 1, 0, 0);
        rightLegM.translate(0, -1, -.5)
        rightLeg = new Cube(rightLegM, brown, this.texture);
        rightLeg.render();

        rightLegM.scale(.9, .9, .8);
        rightLegM.translate(.1, -.3, .1);
        hoof = new Cube(rightLegM, hBrown);
        hoof.render();

        // back left leg
        var backLegM = new Matrix4(bodyPosM);
        backLegM.translate(.3, 0, .65)
        backLegM.translate(0.07, .3, 0.25);
        backLegM.rotate(g_backLegAngle, 1, 0, 0);
        backLegM.translate(0.00, -.5, -.125);
        var backLegPos = new Matrix4(backLegM);
        backLegM.scale(0.15, 0.25, 0.15);
        var backLeg = new Cube(backLegM, brown, this.texture);
        backLeg.render();

        backLegM = backLegPos;
        backLegM.translate(.01, -.1, .01);
        backLegM.scale(.13, .15, .13);
        backLegM.translate(0, 1, .5)
        backLegM.rotate(g_backKneeAngle, 1, 0, 0);
        backLegM.translate(0, -1, -.5)
        backLeg = new Cube(backLegM, brown, this.texture);
        backLeg.render();

        backLegM.scale(.9, .9, .8);
        backLegM.translate(.1, -.3, .1);
        hoof = new Cube(backLegM, hBrown);
        hoof.render();

        // Head
        var headM = new Matrix4(bodyPosM);
        headM.translate(0.1, .5, -.3);
        headM.rotate(0, 0, 0, 1);
        headM.scale(0.4, 0.4, 0.4);
        var headPos = new Matrix4(headM);
        var head = new Cube(headM, brown, this.texture);
        head.render();

        // face
        var eyesM = new Matrix4(headPos);
        eyesM.translate(.25, .7, -.0001);
        eyesM.scale(.1, .1, .1);
        var lEye = new Cube(eyesM, [0, .5, .25, 1], 1);
        lEye.render();

        eyesM.translate(4,0,0);
        var rEye = new Cube(eyesM, [0, .5, .25, 1], 1);
        rEye.render();

        var noseM = new Matrix4(headPos);
        noseM.translate(0.1, .05, -.35);
        noseM.scale(.8, .5, .5);
        var nose = new Cube(noseM, dBrown, this.texture);
        nose.render();

        noseM.translate(.2, .2, -.001);
        noseM.scale(.2,.35,.1);
        var lNos = new Cube(noseM, [0,0,0,1]);
        lNos.render();

        noseM.translate(2, 0, 0);
        var rNos = new Cube(noseM, [0,0,0,1]);
        rNos.render();

        var earM = new Matrix4(headPos);
        earM.translate(-.2, .5, .6);
        earM.scale(.2, .3, .1);
        var lEar = new Cube(earM, dBrown, this.texture);
        lEar.render();

        earM.translate(6,0,0);
        var rEar = new Cube(earM, dBrown, this.texture);
        rEar.render();

        // right horn
        var hornM = new Matrix4(headPos);
        hornM.translate(1,.8,.3);
        hornM.rotate(-90, 0, 0, 1);
        hornM.scale(.07, .6, .07);
        var rHorn1 = new Cone(hornM, 10, [1,1,1,1]);
        rHorn1.render();

        hornM.translate(0, 1, 0);
        hornM.rotate(180, 0, 0, 1);
        var rHorn2 = new Cone(hornM, 10, [1,1,1,1]);
        rHorn2.render();

        hornM = new Matrix4(headPos);
        hornM.translate(1.55, .78, .3);
        hornM.rotate(-45, 0, 0, 1);
        hornM.scale(.07, .6, .07)
        var rHorn3 = new Cone(hornM, 10, [1,1,1,1]);
        rHorn3.render();

        // left horn
        var hornM = new Matrix4(headPos);
        hornM.translate(-1.5, 0, 0);
        hornM.translate(1,.8,.3);
        hornM.rotate(-90, 0, 0, 1);
        hornM.scale(.07, .6, .07);
        var rHorn1 = new Cone(hornM, 10, [1,1,1,1]);
        rHorn1.render();

        hornM.translate(0, 1, 0);
        hornM.rotate(180, 0, 0, 1);
        var rHorn2 = new Cone(hornM, 10, [1,1,1,1]);
        rHorn2.render();

        hornM = new Matrix4(headPos);
        hornM.translate(-.45, .78, .3);
        hornM.rotate(45, 0, 0, 1);
        hornM.scale(.07, .6, .07)
        var rHorn3 = new Cone(hornM, 10, [1,1,1,1]);
        rHorn3.render();

        // tail
        var tailM = new Matrix4(bodyPosM);
        tailM.translate(0.27, .5, 1.0);
        tailM.rotate(g_tailAngle, 1, 0, 0);
        tailM.scale(0.05, 0.05, .6);
        var tail = new Cube(tailM, brown, this.texture);
        tail.render();
    }
     
}