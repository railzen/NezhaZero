#! /bin/bash
goreleaser build --single-target --clean --skip=validate 
mv dist/universal_linux_amd64_v1/nezha-agent .
# nezha-agent service install -s <host>:<Port> --auto-discover <ADKey>