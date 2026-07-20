#!/bin/sh
printf "nameserver 127.0.0.11\nnameserver 8.8.4.4\nnameserver 223.5.5.5\n" > /etc/resolv.conf
# 用 exec 让 app 替换 shell 成为 PID 1，才能收到 docker stop 的 SIGTERM 触发优雅退出
exec /dashboard/app