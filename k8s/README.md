# Setting up OC in k8s

## postgresql

Edit `postgresql-persistentvolume` so it uses a path in your own home directory.

TODO: we need to figure out a good place to put this so it works on everyone's local machine without modification.

Then, apply all these files:

- postgresql-persistentvolume
- postgresql-persistentvolumeclaim
- postgresql-deployment
- postgresql-service