# Tool reference

The blitz.cloud MCP server has these tools. The server's own list on the [AI tools](https://beta.blitz.cloud/ai) page is always current; this page explains the arguments.

Wherever a tool takes `app`, you can pass the app's name, its address label (`blog` in `blog.lena.blitz.cloud`) or its id. If two apps share a name, the server asks for the id instead of guessing. Databases work the same way with their name or id.

Tools marked **asks first** change nothing until the person has agreed. If the client supports elicitation, the server asks the person directly. Otherwise the call has to be repeated with `confirm: true`.

## Apps

| Tool | Arguments | What it does |
|---|---|---|
| `apps_list` | none | Every app with its address, status and what it runs from |
| `apps_get` | `app` | One app in full: status and why, settings still to fill in, storage, restarts, the last lines it printed when it crashed |
| `apps_deploy_store` | `catalogId`, `address`, `name`, `onMainAddress` | Installs an App Store app. The store entry decides the image, port, storage and database |
| `apps_deploy_image` | `image`, `tag`, `address`, `name`, `port`, `worker`, `autoUpdate` | Deploys a public container image. `worker: true` runs it without an address, for bots and background jobs |
| `apps_deploy_github` | `repo`, `branch`, `address`, `name`, `dockerfile` | Builds a GitHub repository and deploys it. Private repositories need GitHub connected in the dashboard |
| `apps_update` | `app`, `name`, `address`, `port`, `autoUpdate`, `keepAwake` | Changes only the fields given. A new address replaces the old one |
| `apps_restart` | `app`, `confirm` | Restarts with the version it runs now. **Asks first** |
| `apps_pause` | `app`, `confirm` | Stops the app until it is resumed. Files and settings stay. **Asks first** |
| `apps_resume` | `app` | Starts a paused or stopped app |
| `apps_delete` | `app`, `databases` (`keep` or `delete`), `confirm` | Deletes the app, its files and its address. **Asks first** |

## App Store and Docker Hub

| Tool | Arguments | What it does |
|---|---|---|
| `store_search` | `query` | Searches the App Store, the apps tested to run on blitz.cloud. Empty lists them all |
| `store_docker_search` | `query` | Searches public Docker Hub images by name. Official images are marked |

## Builds

| Tool | Arguments | What it does |
|---|---|---|
| `builds_start` | `app` | Builds the newest commit on the app's branch and deploys it if the build works |
| `builds_list` | `app`, `limit` | The app's builds, newest first, with the reason a build failed |

## Databases

| Tool | Arguments | What it does |
|---|---|---|
| `dbs_list` | none | Databases with their state and last nightly backup |
| `dbs_create` | `engine` (`postgresql`, `mariadb` or `redis`), `name` | Creates a managed database, backed up every night |
| `dbs_connect` | `database`, `app` | Fills in `DATABASE_URL` and the other settings the app needs, then restarts it |
| `dbs_restart` | `database`, `confirm` | Restarts the database. **Asks first** |
| `dbs_delete` | `database`, `confirm` | Deletes the database and its backups. **Asks first** |

Passwords are never returned. Connecting a database hands them to the app directly.

## Environment variables

| Tool | Arguments | What it does |
|---|---|---|
| `env_list` | `app` | The app's settings, values hidden |
| `env_get` | `app`, `name` | One setting with its value |
| `env_set` | `app`, `name`, `value` | Adds or changes a setting. The app restarts to pick it up |
| `env_delete` | `app`, `name`, `confirm` | Removes a setting. **Asks first** |

## Addresses and DNS

| Tool | Arguments | What it does |
|---|---|---|
| `domains_list` | none | Your main address and its DNS records: the ones blitz.cloud keeps for your apps, read-only, and the ones you added |
| `domains_dns_add` | `type` (`A`, `AAAA`, `CNAME`, `TXT`, `MX`), `name`, `value`, `ttl` | Adds a record under your address. Records that would clash with an app's address are refused |
| `domains_dns_delete` | `record`, `confirm` | Removes a record you added. **Asks first** |

## Private network

| Tool | Arguments | What it does |
|---|---|---|
| `network_list` | none | The Tailscale and WireGuard networks you connected, and which apps are private |
| `network_set_private` | `app`, `isPrivate` | Takes an app off the internet and onto your private networks, or back |

Connecting a network is done in the dashboard, because it needs a secret or a config file.

## Logs and usage

| Tool | Arguments | What it does |
|---|---|---|
| `logs_tail` | `app`, `lines` (up to 500), `previous`, `part` | The last lines the app printed. `previous: true` shows what it printed before its last restart, which is usually where a crash explains itself |
| `usage_get` | none | Your plan and how much of apps, databases, memory and storage is used |

## Errors

A refused call comes back as a tool error with a sentence meant to be read out, for example "There is no app called "shop". The apps here are: Blog, Notes." or "This key has changed something 20 times in the last minute, the most it may. Wait a moment and try again. (42 s)". Plan limits are reported the same way as in the dashboard.
