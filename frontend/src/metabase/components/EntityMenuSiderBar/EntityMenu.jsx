/* eslint-disable react/prop-types */
import cx from "classnames";
import { Component, createRef } from "react";

import EntityMenuItem from "metabase/components/EntityMenuItem";
import EntityMenuTrigger from "metabase/components/EntityMenuTrigger";
import CS from "metabase/css/core/index.css";
import { Popover } from "metabase/ui";

/**
 * @deprecated: use Menu from "metabase/ui"
 */
class EntityMenu extends Component {
  state = {
    open: false,
    freezeMenu: false,
    menuItemContent: null,
    isReady: false,
  };

  static defaultProps = {
    horizontalAttachments: ["left", "right"],
  };

  constructor(props, context) {
    super(props, context);

    this.rootRef = createRef();
  }

  componentDidMount() {
    // 初始化状态为 props 中的 open 值
    this.setState({ open: this.props.open });
    requestAnimationFrame(() => {
      this.setState({ isReady: true });
    });
  }

  componentDidUpdate(prevProps) {
    // 当 props 的 open 变化时，更新内部状态
    if (prevProps.open !== this.props.open) {
      this.setState({ open: this.props.open });
    }
  }

  toggleMenu = () => {
    if (this.state.freezeMenu) {
      return;
    }

    const open = !this.state.open;
    this.setState({ open, menuItemContent: null });
  };

  setFreezeMenu = freezeMenu => {
    this.setState({ freezeMenu });
  };

  replaceMenuWithItemContent = menuItemContent => {
    this.setState({ menuItemContent });
  };

  render() {
    const {
      items,
      triggerIcon,
      triggerProps,
      className,
      openClassNames,
      closedClassNames,
      minWidth,
      tooltip,
      trigger,
      renderTrigger,
      triggerAriaLabel,
      tooltipPlacement,
      transitionDuration = 150,
    } = this.props;
    const { open, menuItemContent, isReady } = this.state;

    return (
      <Popover
        opened={open}
        // className={cx(className, open ? openClassNames : closedClassNames)}
        transitionProps={{ duration: transitionDuration }}
        // onChange={() => this.toggleMenu()}
        position="bottom-end"
        withinPortal={false} // 禁用视口内的定位，让 Dropdown 固定在 bottom-end
        trapFocus={false} // 禁用焦点捕捉，避免触发视口调整
        closeOnEscape={false} // 禁用键盘触发的自动关闭
        positionDependencies={[]} // 禁用位置依赖，防止受视口影响
      >
        <Popover.Target>
          <div>
            {renderTrigger ? (
              renderTrigger({ open, onClick: this.toggleMenu })
            ) : (
              <EntityMenuTrigger
                ariaLabel={triggerAriaLabel}
                trigger={trigger}
                icon={triggerIcon}
                onClick={this.toggleMenu}
                open={open}
                tooltip={tooltip}
                tooltipPlacement={tooltipPlacement}
                triggerProps={triggerProps}
              />
            )}
          </div>
        </Popover.Target>
        <Popover.Dropdown
          sx={{
            position: "absolute", // 直接固定位置
            bottom: 0, // 确保在底部位置
            right: 0, // 确保靠右
          }}
          style={{ background: "none", border: "none", boxShadow: "none" }}
        >
          {menuItemContent || (
            // <ol className={CS.p1} style={{ minWidth: minWidth ?? 184 }}>
            <ol style={{ minWidth: minWidth ?? 184 }}>
              {items.map(item => {
                if (!item) {
                  return null;
                }

                const key = item.key ?? item.title;

                if (item.content) {
                  return (
                    <li key={key} data-testid={item.testId}>
                      <EntityMenuItem
                        icon={item.icon}
                        title={item.title}
                        action={() =>
                          this.replaceMenuWithItemContent(
                            item.content(this.toggleMenu, this.setFreezeMenu),
                          )
                        }
                        tooltip={item.tooltip}
                        color={item.color}
                        hoverColor={item.hoverColor}
                        hoverBgColor={item.hoverBgColor}
                      />
                    </li>
                  );
                }

                if (item.component) {
                  return (
                    <li key={key} data-testid={item.testId}>
                      {item.component}
                    </li>
                  );
                }

                return (
                  <li key={key} data-testid={item.testId}>
                    <EntityMenuItem
                      icon={item.icon}
                      title={item.title}
                      externalLink={item.externalLink}
                      action={
                        item.action &&
                        (e => {
                          item.action(e);
                          this.toggleMenu();
                        })
                      }
                      event={item.event}
                      link={item.link}
                      tooltip={item.tooltip}
                      disabled={item.disabled}
                      onClose={() => {
                        this.toggleMenu();
                        item?.onClose?.();
                      }}
                      color={item.color}
                      hoverColor={item.hoverColor}
                      hoverBgColor={item.hoverBgColor}
                    />
                  </li>
                );
              })}
            </ol>
          )}
        </Popover.Dropdown>
      </Popover>
    );
  }
}

export default EntityMenu;
