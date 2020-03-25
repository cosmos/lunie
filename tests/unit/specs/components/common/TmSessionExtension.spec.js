import { shallowMount } from "@vue/test-utils"
import TmSessionExtension from "common/TmSessionExtension"

describe(`TmSessionExtension`, () => {
  let wrapper, $store, $router

  const accounts = [
    {
      address: "cosmos1234",
      network: "cosmos-hub-mainnet",
      slug: "cosmos-hub"
    },
    {
      address: "cosmos15678",
      network: "cosmos-hub-testnet",
      slug: "cosmos-hub-testnet"
    }
  ]

  const networks = [
    {
      id: "gaia-testnet",
      chain_id: "gaia-123",
      logo_url: "cosmos-logo.png",
      testnet: true,
      title: "Cosmos Hub Test",
      slug: "cosmos-hub-testnet"
    },
    {
      id: "cosmos-hub-mainnet",
      chain_id: "cosmoshub",
      logo_url: "cosmos-logo.png",
      testnet: false,
      title: "Cosmos Hub",
      slug: "cosmos-hub"
    }
  ]

  beforeEach(() => {
    const state = {
      extension: {
        enabled: true,
        accounts
      }
    }

    $store = {
      getters: {
        networkSlug: "cosmos-hub",
        networks
      },
      commit: jest.fn(),
      dispatch: jest.fn(),
      state
    }
    $router = {
      push: jest.fn()
    }
    wrapper = shallowMount(TmSessionExtension, {
      mocks: {
        $store,
        $router
      }
    })
  })

  it("should sign in with the selected account", async () => {
    await wrapper.vm.signInAndRedirect({
      network: "cosmos-hub-mainnet",
      address: "cosmos1"
    })

    expect($router.push).toHaveBeenCalledWith({
      name: "portfolio",
      params: { networkId: "cosmos-hub" }
    })
    expect($store.dispatch).toHaveBeenCalledWith("signIn", {
      sessionType: `extension`,
      address: "cosmos1",
      networkId: "cosmos-hub-mainnet"
    })
  })

  it(`should show a list of all accounts in the extension`, () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it(`should show a guide to install the extension if no extension is installed`, () => {
    wrapper.vm.extension.enabled = false
    expect(wrapper.element).toMatchSnapshot()
  })

  it("should load addresses on mount", () => {
    expect($store.dispatch).toHaveBeenCalledWith("getAddressesFromExtension")
  })

  it("should return the account's project mainnet network if it exists and the testnet checkbox is not checked", () => {
    const self = {
      networks,
      testnet: false
    }
    const signInNetwork = TmSessionExtension.methods.getSignInNetwork.call(
      self,
      accounts[1]
    )
    expect(signInNetwork).toEqual({
      id: "cosmos-hub-mainnet",
      chain_id: "cosmoshub",
      logo_url: "cosmos-logo.png",
      testnet: false,
      title: "Cosmos Hub",
      slug: "cosmos-hub"
    })
  })

  it("should return the account's project testnet network if it exists and the testnet checkbox is not checked", () => {
    const self = {
      networks,
      testnet: true
    }
    const signInNetwork = TmSessionExtension.methods.getSignInNetwork.call(
      self,
      accounts[1]
    )
    expect(signInNetwork).toEqual({
      id: "gaia-testnet",
      chain_id: "gaia-123",
      logo_url: "cosmos-logo.png",
      testnet: true,
      title: "Cosmos Hub Test",
      slug: "cosmos-hub-testnet"
    })
  })
})
