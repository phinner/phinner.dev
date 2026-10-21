---
title: NoHorny
description: Automated image moderation for Mindustry game servers.
tags: [Java, Spring Boot, Machine learning]
landing: built
order: 1
image:
  kind: logo
  src: ./logo.svg
link:
  href: https://github.com/xpdustry/nohorny
  label: Source code
  icon: github
---

<!-- ::what-is-mindustry -->

## The project

Mindustry has blocks that allow players to draw images. You can create pretty cool visuals with them.

<!-- ::start:gallery -->
![A Mindustry logic display rendering a rotating cube](./logic-display.gif)
![A smiley drawn in a Mindustry canvas block](./canvas.webp)
<!-- ::end:gallery -->

Some players use these blocks to display pornographic images on public servers. Other players, including children, can see them before a moderator responds.

NoHorny scans these blocks, renders their images and sends them to a classification server. If an image is marked as unsafe, it **deletes the blocks and bans the offending player**.

## The challenge

NoHorny must process blocks with **as little impact on the game's main loop as possible**.

To do so, I group nearby blocks over several game ticks, then render the combined image and send it for classification on **background threads**.

On the classification server, I had to find a way to keep costs down. So I primarily use a [local classification model](https://huggingface.co/Falconsai/nsfw_image_detection_26?not-for-all-audiences=true). It's fairly accurate and inference takes about 150 ms. But if it's given a very large or unusual image, it can mistakenly mark it as unsafe.

To solve this, I pair it with [Sightengine](https://sightengine.com/), a dedicated content moderation service. The **local model filters out obviously safe images**, and **Sightengine checks the rest**.

This lets me offer a **free public classification service** for other server owners.

## In practice

Now, NoHorny is used by several Mindustry server networks to protect their servers. I keep working with them to make NoHorny easier to deploy and accommodate their needs.

For example, NoHorny can send alerts via Discord webhooks, but some servers are hosted in countries where Discord is banned. To solve this, I implemented a utility to scrape free proxies and route the webhook requests through them.
