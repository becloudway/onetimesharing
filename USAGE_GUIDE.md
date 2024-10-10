<p align="center">
<img src="./app/src/assets/logo-white.png"/>
</p>
<h3 align="center">Safely share your secrets.</h3>

# Usage guide

## Table of Contents

- [Sharing options](#sharing-options)
- [OneClick sharing](#one-click-sharing)
- [PGP Encrypted sharing](#pgp-encrypted-sharing)

## Sharing options

OneTimeSharing has 2 options to share secrets; OneClick sharing and PGP encrypted sharing.

- OneClick sharing is the easiest in use yet it provides a great level of security by sharing only half of the encryption key with the server. This means your client-side encrypted secret cannot be decrypted by administrators of the OneTimeSharing solution

- PGP encrypted sharing is a bit harder to use but it is even more secure as no information of the encryption key is shared with the server. This sharing option should be initiated by the receiver of the secret. 
To help in the creation of the public/private key used for encryption, a guide is made available as well as the option to let the OneTimeSharing client generate the keypair. However, we advise to generate the key yourself to avoid having the private key in the client and browser at all.


## OneClick sharing

Following steps let you share a secret through OneClick sharing

Sender:
1. Enter the secret you want to share
1. (Optional but advised) Create a password for this secret
1. Copy the generated link
1. Share the link with whom you want to share it
1. (Optional but advised) Share the password for this secret through another communication channel (not the same one as in step 4)

Receiver:
1. Open the link
1. (Optional but advised) Enter the password
1. The secret is show to the receiver

**Important:** The link can only be used once (hence the name; OneTimeSharing)

[![OneClick Sender](https://raw.githubusercontent.com/becloudway/onetimesharing/documentation-update/media/OneClick-sender-thumbnail.png)](https://raw.githubusercontent.com/becloudway/onetimesharing/documentation-update/media/oneclick-sender.mp4)

[![OneClick Receiver](https://raw.githubusercontent.com/becloudway/onetimesharing/documentation-update/media/OneClick-receiver-thumbnail.png)](https://raw.githubusercontent.com/becloudway/onetimesharing/documentation-update/media/oneclick-receiver.mp4)

## PGP Encrypted sharing

Following steps let you share a secret through PGP Encrypted sharing

Receiver:
1. Create a public/private keypair
1. Share the public part of the keypair in OneTimeSharing
1. Copy the generated link
1. Share the link with the person that want to share a secret with you

Sender:
1. Open the link
1. Enter the secret you want to share
1. Create the secret

Receiver:
1. Open the link you shared with the sender
1. Download the pgp file
1. Decrypt the pgp file on your machine

**Important:** The link can only be used once (hence the name; OneTimeSharing)

<video width="320" height="240" controls>
  <source src="media/PGP-receiver1.mp4" type="video/mp4">
</video>

<video width="320" height="240" controls>
  <source src="media/PGP-sender.mp4" type="video/mp4">
</video>

<video width="320" height="240" controls>
  <source src="media/PGP-receiver2.mp4" type="video/mp4">
</video>