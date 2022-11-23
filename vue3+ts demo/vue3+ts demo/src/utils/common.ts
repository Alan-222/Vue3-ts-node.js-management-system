import useStore from '@/store';
export function hasPerm(value: string) {
  // console.log(value);

  // 「超级管理员」拥有所有的按钮权限
  const roles = useStore.state.roles;
  if (roles.includes('ROOT')) {
    return true;
  }
  // 「其他角色」按钮权限校验
  if (value) {
    const requiredPerms = value; // DOM绑定需要的按钮权限标识

    const hasPerm = useStore.state.buttons?.some((button) => {
      return requiredPerms.includes(button);
    });

    if (!hasPerm) {
      return false;
    } else {
      return true;
    }
  }
}
