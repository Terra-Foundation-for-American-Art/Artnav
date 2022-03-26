# The Artnav Project
Artnav is a web application built for the Terra Foundation for American Art. It's purpose is to make the online creation and display of publicly viewable "Artmaps" easy and manageable. Below is a brief documentation and synopsis of the technology, and it's usage.

### Artmaps
An "Artmap" is a term to describe a context for viewing artwork in which the art can be zoomed to variable scales. 

### Points 
Navigational "meta" information can be pinned to specific x/y coordinates of the artwork. This kind of "meta" information is called a "Point". Artmap "points" can be read in a natural linear sequence, or as they are denoted on the surface of the artwork, a user can non-linearly explore them as well.

### Collections
Collections are groupings of Artmaps that have institutional or otherwise conceptual commonalities.

### Artists
Artists are the artists of the artworks used in Artmaps. Artists have names and lifespans. There is currently an unused field for  biography text.

---------------------------------------------------------------

# Web Application
The Artnav web application is built using the [Django web framework](https://www.djangoproject.com/), which is a web framework for the Python programming language. 

### Core Project Technologies:
- Django web framework - https://www.djangoproject.com/ - Core web application framework.
- PostgresSQL - https://www.postgresql.org/ - Open Source Relational Database
- Django Rest Framework - https://www.django-rest-framework.org/ - Toolkit for building Web APIs with Django
- Vue.js - a framework for building web user interfaces
- Heroku Web hosting - https://www.heroku.com/ - Managed application hosting platform
- Amazon web services S3 static file hosting
- DLC - The application's IIIF image service, an image hosting service supported by a UK-based cultural institution digital services company called Digirati - https://digirati.com/. 

---------------------------------------------------------------

### Local Backend/API Installation
1. If PostgresSQL isn't installed, install using your preferred method, homebrew or an installer found here: https://www.postgresql.org/download/
2. Create a user `createuser -d -l -P -r -s -p`
3. Create the local database called "artnav" `createdb artnavdb`
4. Artnav uses the `decouple` package to store accessible environment variables in a .env file in the project root. Create a .env file in the root with these key/value pairs:<br>
```
DJANGO_SECRET_KEY=<include a secret string> (generate a secret key for local use here: https://djecrety.ir/)<br>
DB_NAME=artnavdb<br>
DB_USER=<the user you just created above><br>
DB_PASSWORD=<the password for the user><br>
DB_HOST=localhost<br>
ALLOWED_HOSTS=.127.0.0.1,localhost<br>
AWS_ACCESS_KEY_ID=AKIAJCVL476WWR5VNB7Q<br>
AWS_SECRET_ACCESS_KEY=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<br>
AWS_STORAGE_BUCKET_NAME=artmapper-assets<br>
VUE_APP_BASE_URL=http://127.0.0.1:8000/<br>
```
5. Create a python virtual environment, I recommend installing virtualenvwrapper to manage virtual environments (https://virtualenvwrapper.readthedocs.io/en/latest/)<br>
6. Activate the virtual environment with `workon <name of your virtual env>`<br>
7. Install project dependencies by running `pip install -r requirements.txt`<br>
8. Run projects initial data migration to begin using with `python manage.py migrate`<br>
9. Create a superadmin user with `python manage.py createsuperuser`, and follow the prompts.<br>
9. Run project's backend/API locally with `python manage.py runserver`.<br>

---------------------------------------------------------------

### About the client
Artnav has several javascript-rich vue.js applications used throughout the project. They serve specific purposes, and so, they are bound to specific areas of the application. Details on their purposes follow, and further below the bundle assignments are described.

#### Dashboard:
This is the administrative view used for viewing all art in Artnav, creating or deleting new artmaps, and editing collections.

#### Editor:
This is the editing tool used to author artmaps. Authoring artmaps includes the ability to update artwork details (artist, medium, dimenions, credits, art titling), add/remove/edit navigational points of interest, preview artmaps before they're published, and then publish or unpublish artmaps.

#### Artmap:
The Artmap application is the publicly viewable zoomable artmap. This includes published details about the artwork itself, and if included, navigational points of interest.

#### Create New:
Create new is the form used to create new artmaps. It's accessible from any dashboard view.

#### Chunk Vendors:
Any required vendor javascript packages are bundled into here.

### Application Bundles
Artnav has 5 different client bundles. These build configurations are in `vue.config.js`.
They are each used for specific templates in the application.

`editor.js` binds to the Artwork editor template found here:
`artnav/artworks/templates/artworks/artwork.html`.

`artmap.js` binds to the publicly viewable artmap template found here:
`artnav/gallery/templates/gallery/artmap.html`.

`dashboard.js` binds to the project dashboard template found here:
`artnav/dashboard/templates/dashboard/dashboard.html`.

`createnew.js` and `chunk-vendors.js` binds to the project's base template here:
`artnav/templates/base.html`.

---------------------------------------------------------------

### Local Client Installation
Project requires node.js version v14.17.6. Information about updating locally here: https://nodejs.org/en/.

1. cd into `/client` and run `npm install` to install project packages
2. `npm run serve` to serve client for development locally, this will begin the local vue wepback server for development.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

---------------------------------------------------------------

# Deploying the project:
1. Make sure you have Heroku Command Line tools installed - https://devcenter.heroku.com/categories/command-line
2. From `./client` run `npm run build` to build the project's 5 client bundles.
3. From the root, run `python manage.py collectstatic` from collect all built JS bundles into correct directories for project
4. Commit built files / any other project updates to repo and push to master
5. Then run `git push heroku <master>` to deploy changes to production instance
6. If any new data migrations are required, run them with `heroku run python manage.py migrate -a artnav`
