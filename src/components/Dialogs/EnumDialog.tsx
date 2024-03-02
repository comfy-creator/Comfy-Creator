export function EnumDialog() {
  return (
    <div
      className="litegraph litecontextmenu litemenubar-panel dark"
      style={{ pointerEvents: 'auto', transform: 'scale(1)' }}
    >
      <input className="comfy-context-menu-filter" placeholder="Filter list" />
      <div
        className="litemenu-entry submenu"
        data-value="euler"
        style={{
          backgroundColor: 'rgb(204, 204, 204) !important',
          color: 'rgb(0, 0, 0) !important'
        }}
      >
        euler
      </div>
      <div className="litemenu-entry submenu" data-value="euler_ancestral">
        euler_ancestral
      </div>
      <div className="litemenu-entry submenu" data-value="heun">
        heun
      </div>
      <div className="litemenu-entry submenu" data-value="heunpp2">
        heunpp2
      </div>
      <div className="litemenu-entry submenu" data-value="dpm_2">
        dpm_2
      </div>
      <div className="litemenu-entry submenu" data-value="dpm_2_ancestral">
        dpm_2_ancestral
      </div>
      <div className="litemenu-entry submenu" data-value="lms">
        lms
      </div>
      <div className="litemenu-entry submenu" data-value="dpm_fast">
        dpm_fast
      </div>
      <div className="litemenu-entry submenu" data-value="dpm_adaptive">
        dpm_adaptive
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_2s_ancestral">
        dpmpp_2s_ancestral
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_sde">
        dpmpp_sde
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_sde_gpu">
        dpmpp_sde_gpu
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_2m">
        dpmpp_2m
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_2m_sde">
        dpmpp_2m_sde
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_2m_sde_gpu">
        dpmpp_2m_sde_gpu
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_3m_sde">
        dpmpp_3m_sde
      </div>
      <div className="litemenu-entry submenu" data-value="dpmpp_3m_sde_gpu">
        dpmpp_3m_sde_gpu
      </div>
      <div className="litemenu-entry submenu" data-value="ddpm">
        ddpm
      </div>
      <div className="litemenu-entry submenu" data-value="lcm">
        lcm
      </div>
      <div className="litemenu-entry submenu" data-value="ddim">
        ddim
      </div>
      <div className="litemenu-entry submenu" data-value="uni_pc">
        uni_pc
      </div>
      <div className="litemenu-entry submenu" data-value="uni_pc_bh2">
        uni_pc_bh2
      </div>
    </div>
  );
}
