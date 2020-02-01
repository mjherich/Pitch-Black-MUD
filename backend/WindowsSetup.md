1.  Install WSL/Ubuntu.

    1.  As of 11/20/19 this should install Python 3.6.8.  We will be using this version, unlike Mac users, who will use 3.8.  

2.  Open cmd.exe as an administrator and start bash with `bash`

    1.  Type `Python -V' and 'Python3 -V`

        1.  If one of these responds with `Python 3.6.8` use that command from now on

        2.  If neither response is `Python 3.6.8` but one is a higher version of Python, this means one of two things

            1.  If you have manually installed a higher version of Python, we recommend uninstalling it

            2.  If you have not, it is possible that Microsoft has updated WSL and you will need to adjust these instructions to accommodate

        3.  Otherwise, update Ubuntu:

            1.  `sudo apt-get update`

            2.  `sudo apt-get upgrade`

    2.  Repeat 2.1 above to determine if you should use `Python` or `Python3` when using Python.  *Note:* inside the shell, you will always use *Python* as the command.

3.  Using Gitbash, or whichever method you have been using, clone the repository for Build Week 2

4.  Make sure pip is installed for *Python 3*

    1.  `pip --version` and `pip3 --version`.  One of these needs to respond with a version that has a version of Python 3 at the end of the line.  

    2.  If you only have it for 2.7, you will need to install for 3 with:

        1.  `sudo apt update && sudo apt upgrade`

        2.  `sudo apt install python3-pip`

    3.  Check versions and commands again.  You will likely need to use `pip3` for the next step, but it's possible it may be just `pip`.  Use the one with the version associated with Python 3.6.8

5.  Make sure pipenv is installed for Python 3 `python3 -m pipenv --version`

    1.  If not, install pipenv:

        1.  `sudo apt update && sudo apt upgrade` (if you didn't just do this above)

        2.  `pip3 install --user pipenv`

    2.  Check the version again

6.  Try `pipenv shell`.  If this fails, make sure that every reference in the error refers to Python 3.6.  If not, review the above steps

    1.  If the error does refer to 3.6:

        1.  Confirm that `python --version` refers to 2.7.something

        2.  Confirm that `/usr/bin/python3 --version` refers to 3.6.8

        3.  `pipenv --three --python=`which python3``  *NOTE* that there are backticks (`) around *which python3*

        4.  This should create the shell forcing it to use 3.6.8

7.  Open the `pipfile` and change the required version of Python to "3"

        1.  *Your whole team will need to make this change*

        2.  This should allow you to work with colleagues on Macs that have a higher version, but this has yet to be extensively tested.  Please report your experiences to your instructors

8.  [Install Postgres](https://github.com/michaeltreat/Windows-Subsystem-For-Linux-Setup-Guide/blob/master/readmes/installs/PostgreSQL.md)

    1.  *Contrary to the instructions in step 1, do this process using the bash terminal opened in cmd.exe running as an administrator*

    2.  Step 5 is a little confusing.  Paste it into the terminal and it will say `OK` and the `sudo apt-get update` will be entered as an unexecuted command.  Hit `Enter`

    3.  If on Step 6 you get an error complaining about the version of libicu52 or similar install it with:

        1.  sudo add-apt-repository "deb http://security.ubuntu.com/ubuntu xenial-security main" 

        2.  sudo apt-get update

        3.  sudo apt-get install libicu55

        4.  Complete User Setup from the same set of instructions

9.  Install Postgres Server Side Extension:

    1.  `sudo apt-get install libpq-dev`

10. Try `pipenv install`.  This may fail with an error about "psycopg2" related to being unable to find "pg_config"

    1.  Fix with `export PATH=/usr/bin:$PATH` inside the shell

11. Try `pipenv install` again.  If you still have errors, please review the above or ask for help in the help channel

12. Enter the shell with `pipenv shell` and try `python manage.py showmigrations`.

    1.  If this errors because Django is not found, install it: `pipenv install django`

    2.  If this errors because "SECRET_KEY", "DEBUG", or other values are not found, set up a .env as described in the docs
    
    3.  If you see a list of unapplied migrations, you should be ready to apply the migrations and get started
    
        1. If you try to run the server and get additional errors, make sure that you don't have unmade migrations:
        
            1. `python manage.py makemigrations` then `python manage.py migrate`
