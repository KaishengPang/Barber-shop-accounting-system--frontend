import { Modal, notification } from 'antd';
export const openNotification = (title: string, content: string) => {
    notification.open({
        message: title,
        duration: null,
        description: content,
    });
};

export const exist = (src: string | undefined, keyword: string) => {
    if (!src) return false;
    src = src.toLowerCase();
    keyword = keyword.toLowerCase();
    return src.indexOf(keyword) >= 0;
};

export function openConfirm(title: string, callback: () => Promise<void>): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        const modal = Modal.confirm({
            centered: true,
            title: title,
            okText: '确定',
            cancelText: '取消',
            onCancel: () => resolve(false),
            onOk: async () => {
                modal.update({
                    okButtonProps: {
                        loading: true,
                    },
                });
                try {
                    await callback();
                    resolve(true);
                } catch (ex) {
                    resolve(false);
                }
            },
        });
    })
}

export function renderHint(name: string, value: string) {
    return `
        <div style="margin: 0px 0 0;line-height:1;">
          <div style="font-size:14px;color:#666;font-weight:400;line-height:1;">
            ${name}
          </div>
          <div style="margin: 10px 0 0;line-height:1;">
            <div style="margin: 0px 0 0;line-height:1;">
              <div style="margin: 0px 0 0;line-height:1;">
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#FFA989;"></span>
                <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">
                  总量
                </span>
                <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">
                  ${value}
                </span>
                <div style="clear:both"></div>
              </div>
              <div style="clear:both"></div>
            </div>
            <div style="clear:both"></div>
          </div>
          <div style="clear:both"></div>
        </div>
        `;
}
