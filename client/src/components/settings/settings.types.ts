type SettingBase = {
  label: string,
  name: string,
};

export type NumberSetting = SettingBase & {
  inputType: 'number',
  defaultValue: number,
}

export type SelectSetting = SettingBase & {
  inputType: 'select',
  options: Array<{ label: string, value: string}>,
  defaultValue: string,
}

export type CheckboxSettingSetting = SettingBase & {
  inputType: 'checkbox',
  defaultValue: boolean,
}

export type Setting = NumberSetting | SelectSetting | CheckboxSettingSetting;
