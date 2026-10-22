---
title: "Arch on generic ARM"
date: "3/9/2023"
desc: "How to install generic Arch Linux ARM."
tags:
  - arm
  - archlinx
  - arch
  - linux
  - aarch64
  - arm64
  - utm
  - qemu
---

## Why?

Arch Linux is a good distro, but it doesn't **officially** support ARM.

This is a problem if you want to actually run it on an ARM based computer.

So, the [Arch Linux ARM](https://archlinuxarm.org/) project exists, aiming to support lots of ARM computers.

But there is a problem, if you are trying to install it on a generic VM or a computer not explicitly explained by their guides,
then you need to use the generic guide, which is essentially boils down to: "DIY".

So, if you want to install Arch Linux ARM on a **generic** ARM computer (like QEMU or UTM on Apple M1), then read on.

## Note

This might work or might not. It will only work on UEFI systems and I have only tested this on a VM, be cautious
if you are doing it on real hardware.

Also, if you are using something like the raspberry pi, you should use the [official documentation](https://archlinuxarm.org/platforms) instead.

Look at that list first, and only proceed with this guide if your device is not there.

Also this guide doesn't cover duel-boots.

And finally, you should have an ARM v8 (aka. `aarch64`, aka. `arm64`) processor.
This guide will not cover older/32 bit ARM CPU's.

## Preparations

You will need to use another distro to actually do the installation.
I used Fedora, but any distro should in theory work.

and, for the rest of this guide (unless explicitly stated), it is assumed you will be root.
So, switch over to root:

```sh
sudo -s
```

## Partitioning the disks

This part generally assumes you already know how to partition disks, and it doesn't matter how you do it.
I'll use fdisk, but it really doesn't matter.

First, list out your drives with:

```sh
fdisk -l
```

And find the one you want to install with.
Next, enter that drive like so, replace `<xxx>` with your drive:

```sh
fdisk /dev/<xxx>
```

Now that we're in the partitioner, delete all your partitions if you have any by typing `d` and then enter.
Repeat this until you have no more partitions left.

Then, let's create a new GPT disklabel by pressing `g` and then enter.

Now, let's create our partitions.
This will be the UEFI partition, and it will contain our kernels and bootloaders.

Press `n` and then enter twice, and then type in `+500M` to make a partition 500 megabytes in size.

Then, press `t` and type in `1`. This makes our partition have the type of EFI System.

For our root partition, press `n` and then enter three times to create a root partition which takes up the rest
of the disk.

Finally, to save our changes, press `w` and then enter.

## Formatting & Mounting our partitions

First, format the root partition as `ext4`.
The root partition would be the second partition on the drive, for example: `/dev/sda2`.

```sh
mkfs.ext4 /dev/root_partition
```

And then format the EFI System partition.
The EFI system partition would be the first partition on the drive, for example: `/dev/sda1`.

```sh
mkfs.fat -F 32 /dev/efi_system_partition
```

Then, let's mount the root partition:

```sh
mount /dev/root_partition /mnt/arch --mkdir
```

and the EFI partition:

```sh
mount /dev/root_partition /mnt/arch/boot --mkdir
```

## Downloading the OS

If you've done a typical Arch/Gentoo install, you will notice that so far this has been very typical.
This is the part where things start to differ from the typical install guide.
This is because this guide will use efistub to boot the kernel instead of a conventional bootloader.
efistub is basically just allows us to boot directly into the kernel without a bootloader.

First, cd into the drive like so:

```sh
cd /mnt/arch
```

then, let's download the rootfs like so:

```sh
wget http://os.archlinuxarm.org/os/ArchLinuxARM-aarch64-latest.tar.gz
```

You can also use curl, or a browser, it doesn't matter.

Beware that this might take a while.

A rootfs is essentially a linux distribution packaged into a tarball. The entire root filesystem is packaged and distributed.
This makes it excellent for use in containers or `chroot`'s, but it can be more difficult to use if you are using it
for bare metal.

Now that it's done, extract it like so:

```sh
bsdtar -xpvf ArchLinuxARM-aarch64-latest.tar.gz -C /mnt/arch
```

or if you don't have bsdtar:

```sh
tar xpvf ArchLinuxARM-aarch64-latest.tar.gz --xattrs-include='*.*' --numeric-owner -C /mnt/arch
```

which will unpack it into our partitions.

## Making the fstab

Let's now generate the fstab, this file tells the operating system what partitions to mount at boot.

You can either make it yourself, or, you can use `genfstab`.
Making it ourselves is the easier option, so we will do that.

First, get your partition UUID's by running `blkid`. These will also be important later on.

Then, edit the fstab.

Replace the UUID's accordingly, with the first UUID being the one of the first partition,
and the second UUID being the UUID of the second partition.

```sh
cat > /mnt/arch/etc/fstab << "EOF"
UUID=XXXX-XXXX                               /boot    vfat    defaults,noatime    0 2
UUID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX    /        ext4    noatime             0 1
EOF
```

## Making the startup script

Because we are unable to set up **proper** boot functionality without being actually booted into the OS,
we have to use a startup.nsh script.

This is the UEFI's last resort if there is absolutely nothing else available to boot.

Replace the UUID with the UUID of the **root** partition, not the boot one. This is critical.

```sh
cat > /mnt/arch/boot/startup.nsh << "EOF"
Image root=UUID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX rw initrd=\initramfs-linux.img
EOF
```

## Getting ready for first boot

First, unmount the partitions:

```sh
umount /mnt/arch/boot
umount /mnt/arch
```

then, reboot like so:

```sh
reboot
```

## Using the startup.nsh

While you reboot, enter your UEFI settings by pressing whatever key (different on every computer),
and attempt to boot with the UEFI Shell. If you can't find it, remove the live media and attempt to reboot.

Then, it should give you a message about pressing escape to skip startup.nsh. Do **not** press escape.

With any luck, you should be booted into your brand new system! But you're not done yet.

## Networking

As far as I know, Archlinux ARM only comes with tools for ethernet.

If you use ethernet it should work out of the box, if you use wifi, you would have to figure out how to chroot into the new install.

Instructions for chrooting into an Arch install without `arch-chroot` can be found [on the Arch wiki](https://wiki.archlinux.org/title/chroot#Using_chroot). From there you just have to install a wireless manager and whatever else you might need.

You can check your internet by running:

```sh
ping google.com
```

## Getting a proper boot setup

Now that we can boot, let's make this an actual proper system.

Log in as `root` with the password: `root`.

Then, let's setup the keys:

```sh
pacman-key --init
pacman-key --populate archlinuxarm
```

then, update the system:

```sh
pacman -Syu
```

Now, let's install `efibootmgr`:

```sh
pacman -S efibootmgr
```

### Using efistub

If you would like to use efistub for all future boots, read on.
However, you can also use grub, which is a bit easier and more familiar, and if you want to read [Using GRUB](#using-grub).

And create the boot entry:
Replace `<xxx>` with your **disk**, not a partition. So for example, `/dev/sda`.
and the UUID with the UUID of the root partition.
You can get the UUID with the `blkid` command.

```sh
efibootmgr --disk /dev/xxx --part 1 --create --label "Arch Linux ARM" --loader /Image --unicode 'root=UUID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX rw initrd=\initramfs-linux.img' --verbose
```

and then reboot:

```sh
reboot
```

### Using GRUB

If you would like to use grub, first, install the grub package:

```sh
pacman -S grub
```

then install it to your ESP:

```sh
grub-install --target=arm64-efi --efi-directory=/boot --bootloader-id=Arch
```

and generate the config:

```sh
grub-mkconfig -o /boot/grub/grub.cfg
```

and then finally reboot:

```sh
reboot
```

## Finishing up

First, install a text editor like `vim` or `nano`:

```sh
pacman -S nano # for nano
pacman -S vim # for vim
```

you can also delete the tarball we downloaded to save disk space like so:

```sh
rm /ArchLinuxARM-aarch64-latest.tar.gz
```

### Hostname

Then, pick a hostname by editing `/etc/hostname`, for example:

```txt
bobs-pc
```

### Hosts

And set the `/etc/hosts` file to:

```txt
127.0.0.1    localhost
::1          localhost
```

for basic aliases.

### Time zone

Set your timezone like so:

```sh
ln -sf /usr/share/zoneinfo/<Region>/<City> /etc/localtime
```

and run this to generate `/etc/adjtime`:

```sh
hwclock --systohc
```

### Localization

Edit `/etc/locale.gen` and uncomment `en_US.UTF-8 UTF-8` as well as any other locales you want.

To generate them, run:

```sh
locale-gen
```

You should also create `/etc/locale.conf` and set the LANG variable properly:

```txt
LANG=en_US.UTF-8
```

### Users

Add a new user like so:
Replace `<user>` with the name of the user.

```sh
useradd -G wheel,audio,video -m <user>
```

and set the password for the user:

```sh
passwd <user>
```

as well as setting the root password:

```sh
passwd
```

Additionally, Arch Linux ARM comes with a normal user for ssh (`alarm`), but we do not need them, so we can delete them:

```sh
userdel -r alarm
```

## And you're done

You can now reboot the system, and login as the user you created.

## What next?

You can try installing a graphical enviornment (which may be very challenging), or installing other tools.

You may also want to install sudo to install packages and so on.

## Credits

A massive props goes to [this github gist](https://gist.github.com/thalamus/561d028ff5b66310fac1224f3d023c12)
which explains how to do some of the same things, just using a different approach.
