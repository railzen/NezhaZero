//go:build windows

package process

import (
	"os"
	"os/exec"
)

func Replace(executable string, args, env []string) error {
	cmd := exec.Command(executable, args[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = env
	return cmd.Start()
}
