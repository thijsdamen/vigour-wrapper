In App.xaml.cs, add
'''
#if DEBUG
    using MockIAPLib;
    using Store = MockIAPLib;
#else
    using Windows.ApplicationModel.Store;
#endif
'''
and
'''
        private void SetupMockIAP()
        {
#if DEBUG
            MockIAP.Init();

            MockIAP.RunInMockMode(true);
            MockIAP.SetListingInformation(1, "en-us", "A description", "1", "TestApp");

            // Add some more items manually.
            ProductListing single = new ProductListing
            {
                Name = "single",
                ImageUri = new Uri("/Res/Image/2.jpg", UriKind.Relative),
                ProductId = "mtvplay_single_episode",
                ProductType = Windows.ApplicationModel.Store.ProductType.Durable,
                Keywords = new string[] { "single" },
                Description = "Single episode",
                FormattedPrice = "1.0",
                Tag = string.Empty
            };
            MockIAP.AddProductListing("mtvplay_single_episode", single);

            ProductListing monthly = new ProductListing
            {
                Name = "monthly",
                ImageUri = new Uri("/Res/Image/2.jpg", UriKind.Relative),
                ProductId = "mtvplay_subscription_monthly",
                ProductType = Windows.ApplicationModel.Store.ProductType.Durable,
                Keywords = new string[] { "monthly" },
                Description = "Monthly subscription",
                FormattedPrice = "1.0",
                Tag = string.Empty
            };
            MockIAP.AddProductListing("mtvplay_subscription_monthly", monthly);

            ProductListing annual = new ProductListing
            {
                Name = "annual",
                ImageUri = new Uri("/Res/Image/2.jpg", UriKind.Relative),
                ProductId = "mtvplay_subscription_annual",
                ProductType = Windows.ApplicationModel.Store.ProductType.Durable,
                Keywords = new string[] { "annual" },
                Description = "Annual subscription",
                FormattedPrice = "1.0",
                Tag = string.Empty
            };
            MockIAP.AddProductListing("mtvplay_subscription_annual", annual);
#endif
        }
'''
In App.xaml.cs file at the end of the App constructor, add "SetupMockIAP();"