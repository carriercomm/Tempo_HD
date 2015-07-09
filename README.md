vagrant-meteor
==============

[Vagrant](http://www.vagrantup.com/) configuration for a [virtual machine](http://en.wikipedia.org/wiki/Virtual_machine)
that can run [Meteor](https://www.meteor.com/) apps. Can be used on Windows, Mac OS X or Linux.

## Getting started

The following instructions are optimized for Windows users.

### Installation

1. Install [Cygwin](http://www.cygwin.com/install.html) with the packages `openssh` and `rsync`.
2. Add the `<CYGWIN_INSTALL_DIR>/bin` folder to your [PATH](http://geekswithblogs.net/renso/archive/2009/10/21/how-to-set-the-windows-path-in-windows-7.aspx).
3. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads).
4. Install [Vagrant](http://www.vagrantup.com/downloads.html) (1.6.1 or newer is needed).
5. Clone this repo to your local machine.
6. Install and start the Vagrant VM by executing `start.bat`.
It will take a little bit to download and install everything.
Read the next part "File Synchronisation" while it installs. ;-)

### File Synchronisation

The folder is synchronised to two places on the guest. Each synchronized folder has a special purpose.

#### Rsync - one way synchronisation for starting the Meteor app

The folder is synchronised with [Rsync](http://docs.vagrantup.com/v2/synced-folders/rsync.html) to the guest folder `/meteor_cli`.

* You must use this folder to start the Meteor app.
* You must use this folder for `mrt add` and `mrt update`.
* Changes won't be synchronized back to the host and will be deleted after the next sync.

#### Shared Folders - two way synchronisation for file editing

The folders are also synchronised with the [VirtualBox shared folder feature](https://www.virtualbox.org/manual/ch04.html#sharedfolders) to the guest folders `/Tempo_HD` and `/Cadence_HD`.

* Use this folder to make changes in the guest that should be synchronized with the host.
* After you added or updated smart packages you must copy the smart.json and smart.lock file
  from `/meteor_cli` to `/Tempo_HD` with (see [open issue](https://github.com/Sanjo/vagrant-meteor/issues/4)):
  
```bash
cp -f /vagrant/<MY_APP>/smart.* /vagrant2/<MY_APP>/
cp -f /vagrant/<MY_APP>/.meteor/packages /vagrant2/<MY_APP>/.meteor/
```
* Cannot be used to start the Meteor app.
* Cannot be used for `mrt add`, `mrt install` or `mrt update`

### Running Tempo

If this is your first time running vagrant:

1. Install nodejs:

`sudo rm /var/lib/apt/lists/*`

It will complain about being unable to remove a "partial" directory, ignore this

`sudo apt-get update`

`sudo apt-get install nodejs`


2. Start Meteor:

`cd /meteor_cli`

`meteor run`


3. From a new ssh terminal, run cadence.js to populate mongo with test data:

`cd /Cadence_HD`

`node cadence.js`


4. Navigate to localhost:3000 in your host browser!

Skip steps 1 and 3 for subsequent sessions (as long as you didn't run `vagrant destroy`)





## Credited:

Check out the [wiki](https://github.com/Sanjo/vagrant-meteor/wiki) for more details.


CHANGELOG
---------
v1.0 - initial build with Docker
v2.0 - included missing packages in sourcecode
v2.1 - second attempt at adding missing packages