---
title: Moon Stack
date: 2026-09-01
description: Stacking and editing photos for Moon shots
tags:
    - photography
    - stacking
---
# Moon Photo Stacking


## Overview
I recently learned about stacking and editing moon photos. I am no expert, but I just wanna note down what I've learned here in case it could be useful.

The general idea is this. You get caught between New York City and the Moon—yeah, I know it's crazy, but it's true. The best you can do is take out your longest focal length lens and shoot a few photos of [chị Hằng](https://en.wiktionary.org/wiki/ch%E1%BB%8B_H%E1%BA%B1ng). But since the Moon is so far away, we have to shoot it through a lot of atmosphere. Turbulence in the atmosphere makes the Moon shimmer, blur, and distort from one moment to the next. If you remember videos of the Moon taken through a telescope, it's always undulating. That's the interference. See this example below:

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="https://www.youtube.com/embed/ybjUq3Meqb0"
    title="Video presentation"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>

One way to deal with that is [Lucky Imaging](https://en.wikipedia.org/wiki/Lucky_imaging#Explanation). The idea is to take a lot of photos, then keep only the sharpest ones, which happen to be taken during moments of relatively stable air. We align and stack these good frames together. Selecting the good frames helps us avoid atmospheric blur, while stacking reduces random noise and gives us a cleaner image that can tolerate more sharpening. Now, some simple math.

In an ideal case, each aligned image can be written as the same signal + independent random noise:

$$
X_i = S + \epsilon_i
$$

Average $N$ images:

$$
\bar X = S + \frac{1}{N}\sum_{i=1}^N \epsilon_i
$$

The signal $S$ stays the same.

For independent noise, variances add:

$$
\mathrm{Var}\left(\sum_{i=1}^N \epsilon_i\right) = N\sigma^2
$$

Therefore, the variance of the averaged noise is

$$
\mathrm{Var}(\bar\epsilon)
=
\frac{N\sigma^2}{N^2}
=
\frac{\sigma^2}{N}
$$

So its standard deviation is

$$
\sigma_{\mathrm{avg}}
=
\frac{\sigma}{\sqrt N}
$$

Therefore:

$$
\boxed{\mathrm{SNR}_N = \sqrt N\,\mathrm{SNR}_1}
$$

For example, stacking $100$ images reduces random noise to $1/\sqrt{100}=1/10$ and improves SNR by $10\times$.

Of course, this is an ideal result. Video compression, correlated noise, imperfect alignment, and changing atmospheric distortion mean the actual improvement may be smaller. Stacking also can't restore details that are already blurred in every frame. That's why we wanna select the sharp frames first instead of just stacking everything.


How many images should we stack? I have no idea—again, I'm no expert. I've had good results with a few hundred, so maybe a few hundred is a good starting point. But these few hundred are only what we keep from the many more we've taken. How do we get so many? Don't shoot photos; take a video. Assuming we're making a one-minute video at 24 fps, that's already 1,440 images! If we keep 200 of them, that's less than 14%!

Cool, so the general idea is: take a video → extract good frames → stack them → edit.


## Step 1: Taking video of the Moon
You need a long focal length. I read somewhere on Reddit that it's recommended to use at least 400–500mm for the Moon. I don't know, but I happen to have the TTArtisan 500mm F6.3. I've mostly used this lens for taking photos of the Moon, and I think it works very well for that. After all, the Moon is so bright that it's quite easy to work with. Just a personal note on this lens: if you intend to buy it and happen to have a camera with a shorter flange distance, such as a Fuji or Nikon, get the Canon EF version. I have a Fuji and got the Fuji version, so I'm stuck using it only on Fuji. If I had gotten the Canon EF version, it would've been super easy to adapt it to Fuji using a dumb adapter, which would've given me a 750mm-equivalent field of view. If I wanted a roughly 500mm-equivalent field of view, I could use it on my Fuji with a speed booster, which would also give me one extra stop of light. That could be very useful, as this is not a fast lens. Another downside of getting the Fuji version is that the mount is small. It physically blocks the output and restricts it to an APS-C image circle. When I adapt it to my Nikon Z5, it only covers a small area of the sensor for that reason. If I had gotten the Canon EF version, maybe it would've worked well on the Nikon too.

OK, enough ranting.

- Best to use camera + long focal length lens on a sturdy tripod
- Set camera to single point exposure and point to the center of the moon so that it's well exposured
- Video mode, choose highest quality
- Stop down to the sharpest aperture. For TTArtisan 500mm F8 works well for me. I just change ISO until it's well exposed.
- Press AEL, Auto Exposure Lock, so that the exposure is now locked to what we're having. This way even if the Moon drifts away and the focus point is no longer at the moon, it won't change exposure and lit up the moon!
- Record for at least 1m

 At 750mm equivalent, the Moon stays well within the image area; see the video below. Since I'm stacking the whole Moon, that's what I want. Later on, the software that extracts the good frames also needs to detect where the Moon is, so it's best to have it in full view.

<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="https://www.youtube.com/embed/eHfdl7k50z0"
    title="Video presentation"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
</div>

If you just wanna try stacking, you can use the video I took above. First install [yt-dlp](https://github.com/yt-dlp/yt-dlp):

```bash
pip install -U yt-dlp
```

Then download:
```
# let's use this as our working directory
mkdir -p ~/Desktop/test
yt-dlp https://www.youtube.com/watch\?v\=eHfdl7k50z0
```

This gives you a file called `Full Moon [eHfdl7k50z0].webm` inside `~/Desktop/test`. I believe YouTube applies a lot of compression, so this won't be as good as the file from your camera, but it'll do for now. Now let's do some stacking!

## Step 2 - Extract and Stack
Apparently, Autostakkert is the best. Unfortunately, Autostakkert is Windows-only 🥲. So I use [Siril](https://siril.org/), which works great on macOS and is completely free too!

After installing it, use Siril's command line to navigate to our working directory, where we stored the downloaded video file.

![siril_cmd](./moon_stack/siril_cmd.png)

Now that we're in that directory, select the `Conversion` tab in Siril and click on `+`. It'll open a window at `~/Desktop/test`. Select the WebM file, then select `SER Sequence`, give the sequence a name (`moon` here), and click `Convert`.

![siril_convert](./moon_stack/siril_convert.png)

If you switch to the `Console` tab, you'll see output like this. It's extracting the frames. Once it's done, an image of the Moon will show up too. For this video, we end up with 1,979 frames.

![siril_terminal](./moon_stack/siril_terminal.png)

Now we need to register the frames. From [Siril's documentation](https://siril.readthedocs.io/en/stable/preprocessing/registration.html):

> Registration is basically the process of aligning the images from a sequence to be able to process them afterwards. All the processes described hereafter calculate the transformation to be applied to each image in order to be aligned with the reference image of the sequence.

Navigate to the `Registration` tab, you'll see something like this:
![siril_register](./moon_stack/siril_register.png)

There are many registration methods, and I admit I don't fully understand any of them yet—I'm just using them for now. I use KOMBAT, and it has worked well for the Moon so far. This method needs to track and align the object, so we draw a box around the Moon to tell it which area to track (I think). I think the Moon should stay well inside the box throughout the video, though I haven't tested what happens if it doesn't. Once you've drawn the box, click `Register`. It'll take a while.

Once that's done, navigate to the `Plot` tab. You'll see something like this:

![siril_plot](./moon_stack/siril_plot.png)

I'm not 100% sure, but I think this quality score is a relative ranking score, not an absolute one. Essentially, we're ranking all the frames from top to bottom in terms of quality, and each is assigned a score, with 1 being the highest and 0 the worst. Now we'll select which frames to use for stacking based on this score.

Navigate to the `Stacking` tab and select `Sum stacking` for `Method`. Again, there are many stacking methods, and I haven't tested them all, but `Sum stacking` has worked well for the Moon so far. Go to `Image rejection`, choose `quality`, and select what percentage of the frames you wanna use for stacking. Changing this also shows the quality-score threshold used to select images. I usually rely on the quality-score threshold to determine how many to keep because I think increasing the number of frames at the cost of introducing bad ones might give a worse result. What threshold should you use? I don't know. I often try 0.75 or higher, and that has worked well so far. Now just click on `Start stacking` and wait a bit.

![siril_stack](./moon_stack/siril_stack.png)

Now navigate to `Console` again. You'll see something like this:
![siril_save](./moon_stack/siril_save.png)

Our stacking is done! We can take a peek by entering `savejpg moon` and pressing Enter. It'll save a `moon.jpg`, as shown below. As you can see, it looks good, but we want something better. Let's save a TIFF image, which is lossless and can therefore be used for further editing. Simply type `savetif moon` into the command-line box and press Enter. It'll save a rather large file called `moon.tif` (~47MB, compared to the 370KB lossy `moon.jpg`).

![siril_moon](./moon_stack/siril_moon.jpg)


## Step 3 - Editing
This is the fun part!!! I've got next to zero experience with editing, so I'm basically following [Vaonis' tutorial](https://vaonis.com/blogs/travel-journal/tutorial-how-to-process-and-enhance-moon-and-sun-images-with-autostakkert-and-affinity-photo?srsltid=AfmBOop3sCvqbx1UGyapHsc6NFJiDsRv5h6hTmrhYCMabMuCn_Mh5hEX). I have Affinity Photo, so that's what I'm using, but other editing software works too.

I only do the following things:

- high-pass filtering: The Moon contains a lot of high-frequency information, such as the edges of craters. By frequency here, we mean spatial frequency. Around the craters, pixel values change rapidly and are therefore considered "high-frequency." We want to enhance this, so we use high-pass filters.
- color enhancement: This is what's often called a "Mineral Moon." The idea is that different parts of the Moon have different chemical and mineral compositions and therefore reflect slightly different colors. The differences are very, very small, so the Moon simply looks gray to our naked eyes. But we can boost these differences by increasing the saturation, which will add some color to the final image.


Right-click on `moon.tif` and open it with Affinity Photo. First, let's crop it. Just select the crop symbol in the box on the left, draw a rectangle around the Moon, then press `Apply`.
![affinity_crop](./moon_stack/affinity_crop.png)

Add a high-pass filter:
![affinity_hf](./moon_stack/affinity_hf.png)

The filter layer is added to the box on the right under the `Layers` tab. Move it above the `Background` (our base image). If you click on the symbol for the high-pass filter, it'll open a control box where we can change the filter's parameters. Set the radius to 1px and use `Linear Light`. Press Enter and close it.
![affinity_hf_2](./moon_stack/affinity_hf_2.png)

You can select that high-pass filter, press Cmd+C, then press Cmd+V to paste it and create new filters. They'll work in a chain, meaning filter 1 → filter 2 → ... I use four filters, all with `Linear Light`, with radii of 1px → 1px → 0.5px → 0.1px. As you add more filters, you'll see the areas around the craters become sharper. How much you do depends on your taste.

Now we change the saturation. Go to `Layer` → `New adjustment layer` → `HSL...`. Again, I copy and paste to get multiple layers, and they'll work in a chain. You can play around with the settings for each one. In this example, I change only `Saturation`: 50% → 25% → 10%.
![affinity_hsl](./moon_stack/affinity_hsl.png)
![affinity_hsl_2](./moon_stack/affinity_hsl_2.png)

Below is what I ended up with. It's not very sharp, I believe it's due to the video being compressed by youtube.
![moon_edited](./moon_stack/moon_edited.jpg)

Here's what I got from the same video before youtube:
![p100_color](./moon_stack/p100_color.jpg)


## Conclusion
I'm sure I've made some mistakes or misunderstood some concepts here and there, but hopefully this post can be a good starting point for anyone who's like I was a while back and is curious about how to get a sharp shot of the Moon. Of course, you should try changing all the editing parameters, such as the hue in the HSL layer, or adding more filters of different types... Below are some example Moon shots I've taken and edited using this workflow.

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DcdeXy1nCk-/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DcdeXy1nCk-/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/DcdeXy1nCk-/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Lei Haas (@leisaueha)</a></p></div></blockquote>

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DcmxuKYEc4w/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/DcmxuKYEc4w/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/DcmxuKYEc4w/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Lei Haas (@leisaueha)</a></p></div></blockquote>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(async () => {
  await nextTick()

  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process()
  } else {
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.onload = () => window.instgrm?.Embeds.process()
    document.body.appendChild(script)
  }
})
</script>
