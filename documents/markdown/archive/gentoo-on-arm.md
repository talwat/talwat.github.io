---
title: "Gentoo on ARM"
date: "3/2/2023"
desc: "The various hurdles of installing gentoo on an ARM computer."
tags:
  - arm
  - gentoo
  - linux
  - aarch64
  - arm64
  - utm
  - qemu
---

## The context

One day, I was using my M1 mac to look at the gentoo docs for fun.
I wanted to try and install gentoo on an ARM VM using UTM, but when I looked at the handbook, it was empty.
I then just abandoned the idea and installed it instead on an x86_64 VM.
But I wanted to come back to it, because it was a cool project, and see if I could do it.

## Setting up

First off, you should use the [AMD64 handbook](https://wiki.gentoo.org/wiki/Handbook:AMD64/Full/Installation) for most of the proccess.
This post will mainly cover the differences and what tweaks you have to do rather than a full handbook.

## Warning

You probably shouldn't do this on real hardware, and good luck if you're trying to use real hardware
or you want graphics.

## The ISO

Just use the arm64 iso. Gentoo **does** support arm64, it's just the install guide is missing.
This means that (at least some) packages **will** compile on arm64.

## The stage tarball

Use the arm64 stage tarball, obviously.
I made the mistake of using an amd64 stage tarball, and not suprisingly, it didn't work.

## The system logger

The gentoo install guide recommends [sysklogd](https://packages.gentoo.org/packages/app-admin/sysklogd),
but you might get an error when you try and compile it, because it isn't stable on ARM yet.

You can use the two other options listed, [syslog-ng](https://packages.gentoo.org/packages/app-admin/syslog-ng), or
[metalog](https://packages.gentoo.org/packages/app-admin/metalog).

For syslog-ng, you can just install it using `emerge` and then enable the service with openrc, like so:

```sh
rc-update add syslog-ng default
```

This is all assuming you **want** a system logger, because you don't actually need one.
If you go the systemd route, you don't need to do any of this, because systemd ~~forces apon you~~ uses it's own logger.

## The bootloader

**Note**: I will not cover MBR booting, because I don't feel like it.
This is surprisingly simple, just specify to GRUB you're using arm64:

```sh
echo 'GRUB_PLATFORMS="efi-64"' >> /etc/portage/make.conf
emerge --ask sys-boot/grub
grub-install --target=arm64-efi --efi-directory=/boot
grub-mkconfig -o /boot/grub/grub.cfg
```

and you're done!

## Conclusion

The primary reason you might run into issues with this guide is the same reason there isn't an official one:
ARM devices vary wildly, and you are bound to run into issues with a single one-size-fits-all guide.

But, this guide does work on UTM when I tested it, so take that as you will.

Gentoo is an awesome distro, and is very unique in it's customizability, and I would recommend to every
computer nerd to give it a go.
