# Piaf

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b64ba7294eca479181b52d30a7d2e9d7)](https://app.codacy.com/app/guillim/piaf?utm_source=github.com&utm_medium=referral&utm_content=etalab/piaf&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/etalab/piaf.svg?branch=master)](https://travis-ci.org/etalab/piaf)

<abbr title="Pour Une IA Francophone">Piaf</abbr> is an open-source QA (question answering) annotation plateform.  
It handles the following features :  
* nice UI (conceived by a designer)
* contributor enrollment (signup & mail validation)
* contributor certification (by any member of the _admin_ team)
* _admin_ team administration (by the super-admin)
* input/output of texts to be annotated using the SQuAD format
* users scoring (for bot and troll removal)
* annotations managment


## 1. Installation

First clone the repo:

```bash
git clone https://github.com/LouisDuverneuil/piaf_adaptation.git
cd piaf_adaptation
```

Then create the environment variables (you can customise your API keys and passwords):
```bash
cp .env-example .env
```


Now you have tow options : install the app with Docker or without

### Installing with Docker

As a prerequisite, you need to have installed Docker & Docker-compose on your computer.

Then, type:

```bash
docker-compose pull
```

### Installing without

As a prerequisite, you need to have installed on your computer:

* Python 3.6+
* Django 2.1.7+
* Node.js 8.0+
* Chromium (recommended)


First install Python dependencies:

```bash
sudo apt-get install libpq-dev  # Linux/Debian only
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Then compile the frontend:

```bash
make build-statics
```

> When developing the frontend, you may prefer watching for files changes.
> Run `npm start` (instead of `npm run build`) for building and hot reloading.

## 2. Running


### Running with Docker

```bash
make up
```
Have a look at the Makefile for more details
### Running without

First prepare the database:

```bash
cd src
python manage.py migrate
```

Then create the admin user:

```bash
python manage.py create_admin --noinput --username "admin" --email "admin@example.com" --password "password"
```

And finally run the Django server:

```bash
python manage.py runserver
```

> Note that Django permits to run the server on a different IP or port. `python manage.py runserver <ip>:<port>`

## 3. Setting up your annotation campaign

### Reach the Admin panel
Open your web-browser at http://127.0.0.1:8000/login/ and login with the admin you created above (username: "admin", password: "password")

You will then be able to reach the admin panel, for any administration task you may require:
[127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)


### Importing texts

Go to : [127.0.0.1:8000/app/admin](http://127.0.0.1:8000/app/admin)

Note that only `JSON` files can be imported. Furthermore, they need to match exaclty the [SQuAD](https://rajpurkar.github.io/SQuAD-explorer/) format. But, we accept some extra fields :
- __"categorie"__ : can be one of the followings - 'Religion', 'Géographie', 'Histoire', 'Sport', 'Arts', 'Société', 'Sciences' default to 'Société' if empty
- __"displaytitle"__ : if you need a more deligthful title (falls back to title if empty)
- __"reference"__ : integer like *7138870* for Wikipedia reference (falls back to 0 if empty)

Here is an example of input dataset: <a href="/input-dataset-example.json" download="example.json" target="_blank">Click here to download</a>


### Annotation

Simply reach : [app/](http://127.0.0.1:8000/app/)


### Exploring results

Again, on the page : [app/admin](http://127.0.0.1:8000/app/admin)

Only possible format is JSON.


## configuration

Passing most settings as environment variable will override the default settings. Here are some of the variable customisable:

```bash
DJANGO_ALLOW_SIGNUP=True # Allow users to singup (for crowdsourcing)
DJANGO_USE_MAILJET=False # use Mailjet or the native Django mail service
DJANGO_MAILJET_API_KEY=ffdfsfcfs2a00ad5ef367bfdsflsdk # put your Mailjet API key here, this is an example resulting in Errors
DJANGO_MAILJET_SECRET_KEY=nhf41cc0d45ffsdfs6fdsfdsffdsfsf # put your Mailjet API secret here, this is an example resulting in Errors
MATOMO_SITE_ID= # Matomo id
WEBPACK_ENVIRONMENT_PRODUCTION=False # build the frontend  or run a 'npm run serve'
```

### with Docker
Edit the .env file

### without
Set the environment variable before launching your server
```
DEBUG=0 MATOMO_SITE_ID=77 src/manage.py runserver
```

this Will disable debugging and activate Matomo tracking for instance

## Contact

Feel free to [submit any feedback](https://github.com/etalab/piaf/issues/new).


## Acknowledgements

PIAF plateform was originally inspired by [Doccano](https://github.com/chakki-works/doccano). The PIAF team contributed to Doccano repository until the Doccano project was to far from PIAF needs.

## License

2018 chakki.  
2019 DINUM, Guillim.  
2020 DINUM, Guillim.  

This application is published under the MIT license.
