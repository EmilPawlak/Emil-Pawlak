+++
date = "2026-03-30"
draft = false
title = "Craft - HackTheBox"
categories = ["Pentesting", "HackTheBox"]
tags = ["CPTS"]
summary = "Craft is a medium difficulty Linux box, hosting a Gogs server with a public repository. One of the issues in the repository talks about a broken feature, which calls the eval function on user input. This is exploited to gain a shell on a container, which can query the database containing a user credential. After logging in, the user is found to be using vault to manage the SSH server, and the secret for which is in their Gogs account. This secret is used to create an OTP which can be used to SSH in as root."
+++

### Summery

