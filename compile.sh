#! /bin/bash
goreleaser build --single-target --clean --skip=validate 
if [ $? -ne 0 ]; then
    echo "Command failed, exiting script"
    exit 0
fi
sudo cp -f ./dist/linux_amd64_linux_amd64_v1/dashboard-linux-amd64 /opt/nezha/dashboard/app 
sudo systemctl restart nezha-dashboard