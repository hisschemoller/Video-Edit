/**
 * Create a score clip that draws it's image content on canvas.
 * @param {Object} specs 
 * @returns {Object} Clip API methods.
 */
export default function createClip(specs = {}) {
  const { framerate } = specs;
  const img = new Image();

  let imgURLPrefix,
    imgURLSuffix = '.png',
    imgURLNr,
    globalStartPosition,
    isPlaying = false,
    translateX = 0,
    translateY = 0,
    clipStart, distanceX, distanceY, dx, dy, dWidth, dHeight, endTime, flipHorizontal, startTime, sx, sy, sWidth, sHeight, resource, resourceID, zIndex,

  start = function(data, isVideoCapture, position) {
    ({ clipStart, distanceX, distanceY, dx, dy, dWidth, dHeight, end: endTime, flipHorizontal, start: startTime, sx, sy, sWidth, sHeight, resource, resourceID, zIndex, } = data);
    isPlaying = true;
    globalStartPosition = position;
    
    imgURLPrefix = resource.url;
    imgURLNr = Math.round(clipStart * framerate) + 1;
    img.src = imgURLPrefix + ((imgURLNr <= 99999) ? ('0000' + imgURLNr).slice(-5) : '99999') + imgURLSuffix;
    console.log('start clip', resourceID);
  },
  
  end = () => {
    console.log('end clip', resourceID);
    isPlaying = false;
    imgURLPrefix = '';
  },

  /**
   * Draw the video clip frame on canvas.
   * @param {Object} ctx Canvas drawing context.
   */
  draw = function(ctx) {
    if (flipHorizontal) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(img, sx + translateX, sy + translateY, sWidth, sHeight, dx + translateX, dy + translateY, dWidth, dHeight);
      ctx.restore();
    } else {
      ctx.drawImage(img, sx + translateX, sy + translateY, sWidth, sHeight, dx + translateX, dy + translateY, dWidth, dHeight);
    }
  },

  capture = function(ctx, framerate) {
    draw(ctx);
    video.currentTime += 1 / framerate;
  },

  update = function(position) {
    if (isPlaying) {
      if (position < endTime) {
        const positionNormalized = (position - startTime) / (endTime - startTime);
        if (distanceX) {
          translateX = distanceX * positionNormalized;
        }
        if (distanceY) {
          translateY = distanceY * positionNormalized;
        }
        let localPosition = ((position - globalStartPosition) / 1000) + clipStart;
        let newImgURLNr = Math.min(Math.floor(localPosition * framerate) + 1, resource.frames);
        if (newImgURLNr !== imgURLNr) {
          if (newImgURLNr <= resource.frames) {
            imgURLNr = newImgURLNr;
            img.src = imgURLPrefix + ((imgURLNr <= 99999) ? ('0000' + imgURLNr).slice(-5) : '99999') + imgURLSuffix;
          } else {
            // end();
          }
        }
      } else {
        end();
      }
    }
  },

  getIsPlaying = function() {
    return isPlaying;
  },

  getZIndex = function() {
    return zIndex;
  };

  return {
    capture,
    draw,
    getIsPlaying,
    getZIndex,
    start,
    update,
  };
}
