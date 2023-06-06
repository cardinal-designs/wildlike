import { AddressForm } from '@shopify/theme-addresses';

export const AddressFormProvider = () => {
  if ( document.querySelector('.template-addresses') ) {
    const forms = document.querySelectorAll('[data-address="root"]');
    forms.forEach((form) => {
      AddressForm(form, 'en', {
        shippingCountriesOnly: true
      });
    });
    const toggleForm = (currentForm) => { currentForm.classList.toggle('u-hidden'); };

    document.querySelectorAll('[data-address-toggle]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();

        let button = event.target;
        const parent = button.closest('.customer-address-container');
        const currentMenu = button.closest('.address-card-menu');
        const form = parent.querySelector('.customer-address-form');

        toggleForm(form);
      });
    });

    document.querySelectorAll('[data-address-delete-form]').forEach((deleteForm) => {
      deleteForm.addEventListener('submit', (event) => {
        const confirmMessage = event.target.getAttribute('data-confirm-message');

        if (!window.confirm(confirmMessage || 'Are you sure you want to delete this address?')) {
          event.preventDefault();
        }
      });
    });
  };
};
