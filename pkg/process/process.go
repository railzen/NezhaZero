//go:build !windows

package process

import "syscall"

func Replace(executable string, args, env []string) error {
	return syscall.Exec(executable, args, env)
}
