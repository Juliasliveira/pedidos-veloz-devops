variable "aws_region" {
  default = "us-east-1"
}
variable "cluster_name" {
  default = "pedidos-veloz-cluster"
}
variable "common_tags" {
  type = map(string)
  default = {
    Project     = "pedidos-veloz"
    Environment = "production"
    ManagedBy   = "terraform"
  }
}
