var WH = WH || {};

(function(WH) {

    WH.createClip = function(specs, my) {

        let that,
            data,
            isPlaying = false;

        const video = specs.video,

            start = function(newData, isCapture) {
                data = newData;
                console.log(data);
                video.currentTime = data.clipStart;
                isPlaying = true;
                
                if (!isCapture) {
                    video.play();
                }
            },

            draw = function(ctx) {
                ctx.drawImage(video, data.x, data.y, data.width, data.height, data.x, data.y, data.width, data.height);
            },
            
            capture = function(ctx, framerate) {
                draw(ctx);
                video.currentTime += 1 / framerate;
            }

            getIsPlaying = function(time) {
                if (isPlaying && time >= data.end) {
                    isPlaying = false;
                    video.pause();
                }
                return isPlaying;
            };

        that = specs.that || {};

        that.start = start;
        that.draw = draw;
        that.capture = capture;
        that.getIsPlaying = getIsPlaying;
        return that;
    };

})(WH);
