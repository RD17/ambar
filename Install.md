# Install docker and docker-compose

To install and configure Ambar you need an expertise in unix, Docker and Docker Compose.
If you have any difficulties installing and running Ambar you can request a dedicated support session by mailing us on [hello@ambar.cloud](mailto:hello@ambar.cloud)

Please refer to official [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installation instructions.

To check if everything is installed correctly please run:

```
> docker -v
Docker version 18.03.0-ce, build 0520e24

> docker-compose -v
docker-compose version 1.20.1, build 5d8c71b
```

# Set up your environment

To make Ambar run properly on your host, you shoud set these system parameters (as superuser):

```
sysctl -w vm.max_map_count=262144
sysctl -w net.ipv4.ip_local_port_range="15000 61000"
sysctl -w net.ipv4.tcp_fin_timeout=30
sysctl -w net.core.somaxconn=1024
sysctl -w net.core.netdev_max_backlog=2000
sysctl -w net.ipv4.tcp_max_syn_backlog=2048
sysctl -w vm.overcommit_memory=1
```

To keep these setting after reboot you should add them into your `/etc/sysctl.conf` file.


# Create docker-compose file

Download latest [docker-compose file](https://github.com/RD17/ambar/blob/master/docker-compose.yml) from our GitHub.

Then modify it:

- Replace ```${dataPath}``` values with desired path to the folder where you want Ambar to store all its data.
- Replace ```${langAnalyzer}``` value with language analyzer you want Ambar apply while indexing your documents, supported analyzers: English ```ambar_en```, Russian ```ambar_ru```, German ```ambar_de```, Italian ```ambar_it```, Polish ```ambar_pl```, Chinese ```ambar_cn```, CJK ```ambar_cjk```
- Replace ```${ambarHostIpAddress}``` value with the IP address of your Ambar server

## Set up your crawlers

- Find ```${crawlerName}``` block - this is a template for your new crawler
- Replace ```${crawlerName}``` with desired name for your crawler (only lowercase latin letters and dashes are supported). Check that service block name and  crawler name are the same
- Replace ```${pathToCrawl}``` with path to a local folder to be crawled, if you want to crawl SMB or FTP - just mount it with standard unix tools

### Optional settings
- `ignoreFolders` - ignore fodlers by [glob pattern](https://github.com/isaacs/node-glob#glob-primer)
- `ignoreExtensions` - ignore file extensions by [glob pattern](https://github.com/isaacs/node-glob#glob-primer) (default: .{exe,dll})
- `ignoreFileNames` - ignore file names by [glob pattern](https://github.com/isaacs/node-glob#glob-primer) (default: ~*)
- `maxFileSize` - max file size (default: 300mb)

### Crawler configuration example:
```
Docs:
    depends_on: 
      serviceapi: 
        condition: service_healthy 
    image: ambar/ambar-local-crawler
    restart: always
    networks:
      - internal_network
    expose:
      - "8082"
    environment:      
      - name=Docs
      - ignoreFolders=**/ForSharing/**
      - ignoreExtensions=.{exe,dll,rar}
      - ignoreFileNames=*backup*
      - maxFileSize=15mb
    volumes:
      - /media/Docs:/usr/data
```


You can add more crawlers by copying ```${crawlerName}``` segment and editing its settings (don't forget to edit the service name).

# Start Ambar

Run ```docker-compose pull``` to pull latest Ambar images.

To start Ambar run ```docker-compose up -d```.

Ambar UI will be accessible on ```http://${ambarHostIpAddress}/```

If you have any difficulties installing and running Ambar you can request a dedicated support session by mailing us on [hello@ambar.cloud](mailto:hello@ambar.cloud)
