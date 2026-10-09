terraform {
  required_providers {
    scaleway = {
      source = "scaleway/scaleway"
    }
  }
}

provider "scaleway" {
  region = "fr-par"
  zone   = "fr-par-1"
  project_id = "cbe9d5c9-1fb5-4180-b2d2-3b2e8dbbb2e7"
}

variable "DISCORD_BOT_TOKEN" {
  type      = string
  sensitive = true
}
variable "DISCORD_BOT_PREFIX" {
  type      = string
  sensitive = true
}
variable "DISCORD_TEST_PREFIX" {
  type      = string
  sensitive = true
}
variable "SCW_SECRET_KEY" {
  type      = string
  sensitive = true
}

# TODO - Remove
resource "scaleway_instance_ip" "public" {}

resource "scaleway_instance_server" "server" {
  type  = "DEV1-S"
  image = "ubuntu_resolute"

  ip_id = scaleway_instance_ip.public.id

  user_data = {
    cloud-init = templatefile("${path.module}/cloud-init.yml", {
      SSH_PUBLIC_KEY = file("~/.ssh/id_rsa.pub")
      DISCORD_BOT_TOKEN = var.DISCORD_BOT_TOKEN
      DISCORD_BOT_PREFIX = var.DISCORD_BOT_PREFIX
      DISCORD_TEST_PREFIX = var.DISCORD_TEST_PREFIX
      SCW_SECRET_KEY = var.SCW_SECRET_KEY
    })
  }
}

output "public_ip" {
  value = scaleway_instance_ip.public.address
}
